import React, { useState } from "react";
import Swal from "sweetalert2";

const ReturnVehicleForm = ({ assignmentId, onSave, onCancel, isLoading, startOdometer }) => {
  const [formData, setFormData] = useState({
    end_datetime: new Date().toISOString().slice(0, 10),
    end_odometer: "",
    notes: "",
  });

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-gray-50 p-4 rounded-lg my-4 border animate-fade-in-down"
    >
      <h4 className="font-medium text-gray-800">Form Pengembalian Kendaraan</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="">
          <label htmlFor="end_datetime" className="font-xs text-gray-500">
            Tanggal Kembali
          </label>
          <input
            type="date"
            name="end_datetime"
            id="end_datetime"
            value={formData.end_datetime}
            onChange={handleChange}
            className="block px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="">
          <label htmlFor="end_odometer" className="font-xs text-gray-500">
            Odometer Selesai (KM/HM)
          </label>
          <input
            type="number"
            name="end_odometer"
            id="end_odometer"
            value={formData.end_odometer}
            min={startOdometer}
            onChange={handleChange}
            required
            className="block mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:bg-gray-400"
        >
          {isLoading ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </form>
  );
};

export default ReturnVehicleForm;
