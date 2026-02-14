import React, { useState, useEffect } from "react";
import api from "../../../api";
import Swal from "sweetalert2";

const ReturnToolModal = ({ requisitionId, onClose, onSuccess }) => {
  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load Data Gudang
  useEffect(() => {
    const fetchWarehouses = async () => {
      setIsLoading(true);
      try {
        const response = await api.get("/v1/warehouses");
        setWarehouses(response.data.data || response.data);
      } catch (error) {
        console.error("Gagal load gudang", error);
        Swal.fire("Error", "Gagal memuat data gudang.", "error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchWarehouses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedWarehouse) {
      Swal.fire("Peringatan", "Harap pilih gudang tujuan!", "warning");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.put(`/v1/tool-requisitions/${requisitionId}`, {
        status: "Returned",
        warehouse_id: selectedWarehouse,
        return_notes: notes,
      });

      Swal.fire({
        title: "Berhasil!",
        text: "Alat berhasil dikembalikan ke stok.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      Swal.fire(
        "Gagal",
        error.response?.data?.message || "Gagal memproses pengembalian.",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-gray-50 p-4 rounded-lg my-4 border animate-fade-in-down"
    >
      <h4 className="font-medium text-gray-800">Form Pengembalian Alat</h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* INPUT 1: PILIH GUDANG */}
        <div className="">
          <label
            htmlFor="warehouse_id"
            className="text-xs font-medium text-gray-500 block mb-1"
          >
            Kembalikan ke Gudang Mana? <span className="text-red-500">*</span>
          </label>
          <select
            id="warehouse_id"
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
            disabled={isLoading}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">-- Pilih Gudang Tujuan --</option>
            {warehouses.map((wh) => (
              <option key={wh.id} value={wh.id}>
                {wh.warehouse_name}
              </option>
            ))}
          </select>
        </div>

        {/* INPUT 2: CATATAN */}
        <div className="">
          <label
            htmlFor="notes"
            className="text-xs font-medium text-gray-500 block mb-1"
          >
            Catatan Pengembalian
          </label>
          <input
            type="text"
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Contoh: Kondisi baik, lengkap"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:bg-gray-400 hover:bg-blue-700 transition-colors"
        >
          {isSubmitting ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </form>
  );
};

export default ReturnToolModal;
