import React, { useState, useEffect } from "react";
import api from "../../../api";
import Swal from "sweetalert2";

const IssueToolModal = ({ requisitionId, onClose, onSuccess }) => {
  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchWarehouses = async () => {
      setIsLoading(true);
      try {
        const response = await api.get("/v1/warehouses");
        setWarehouses(response.data.data || []);
      } catch (error) {
        console.error("Gagal memuat data gudang", error);
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
      Swal.fire("Peringatan", "Harap pilih gudang sumber!", "warning");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.put(`/v1/tool-requisitions/${requisitionId}`, {
        status: "Issued",
        origin_warehouse_id: selectedWarehouse,
      });

      Swal.fire(
        "Berhasil",
        "Permintaan disetujui & stok dikeluarkan.",
        "success"
      );
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("Issue failed:", error);
      Swal.fire(
        "Gagal",
        error.response?.data?.message || "Gagal memproses approval.",
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
      <h4 className="font-medium text-gray-800">Form Approval & Issue Alat</h4>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label
            htmlFor="origin_warehouse"
            className="text-xs font-medium text-gray-500 block mb-1"
          >
            Ambil dari Gudang Mana? <span className="text-red-500">*</span>
          </label>
          <select
            id="origin_warehouse"
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
            disabled={isLoading}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">-- Pilih Gudang Sumber --</option>
            {warehouses.map((wh) => (
              <option key={wh.id} value={wh.id}>
                {wh.warehouse_name}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Stok alat akan dikurangi otomatis dari gudang ini.
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {isSubmitting ? "Memproses..." : "Konfirmasi Issue"}
        </button>
      </div>
    </form>
  );
};

export default IssueToolModal;
