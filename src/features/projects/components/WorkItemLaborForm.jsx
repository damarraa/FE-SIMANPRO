import React, { useState, useEffect } from "react";
import useLaborTypesList from "../../projects/hooks/useLaborTypesList";

const WorkItemLaborForm = ({
  onSave,
  onCancel,
  isLoading,
  initialData = {},
}) => {
  const { laborTypes, isLoading: isLoadingLaborTypes } = useLaborTypesList();
  const [formData, setFormData] = useState({
    labor_type_id: "",
    quantity: "",
    rate: "",
  });

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        labor_type_id:
          initialData.labor_type?.id || initialData.labor_type_id || "",
        quantity: initialData.quantity || "",
        rate: initialData.rate || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "labor_type_id") {
      const selectedId = parseInt(value, 10);
      const selectedLaborType = laborTypes.find((lt) => lt.id === selectedId);

      setFormData((prev) => ({
        ...prev,
        labor_type_id: value,
        rate: selectedLaborType ? selectedLaborType.rate : "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const laborTypeIdNum = parseInt(formData.labor_type_id, 10);
    if (isNaN(laborTypeIdNum)) {
      console.log("Silakan pilih jenis jasa terlebih dahulu.");
      return;
    }

    const selectedLaborType = laborTypes.find((lt) => lt.id === laborTypeIdNum);
    const dataToSave = {
      labor_type_id: laborTypeIdNum,
      quantity: parseFloat(formData.quantity),
      rate: parseFloat(formData.rate),
      labor_type: selectedLaborType,
    };
    onSave(dataToSave);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-gray-50 p-5 rounded-lg mb-4 border"
    >
      <h4 className="font-medium text-gray-800">
        {initialData && Object.keys(initialData).length > 0
          ? "Edit Rincian Jasa"
          : "Tambah Rincian Jasa Baru"}
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <label
            htmlFor="labor_type_id"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Jenis Jasa/Pekerja
          </label>
          <select
            name="labor_type_id"
            id="labor_type_id"
            value={formData.labor_type_id}
            onChange={handleChange}
            required
            disabled={isLoadingLaborTypes}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Pilih Jenis Jasa</option>
            {laborTypes.map((lt) => (
              <option key={lt.id} value={lt.id}>
                {lt.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="quantity"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Kuantitas (misal: Hari, Jam)
          </label>
          <input
            id="quantity"
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            step="any"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="rate"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Upah / Rate
          </label>
          <input
            id="rate"
            type="number"
            name="rate"
            value={formData.rate}
            onChange={handleChange}
            required
            step="any"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      <div className="flex justify-end gap-4 mt-4 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-[#2196F3] text-white px-6 py-2 rounded-lg disabled:bg-gray-400"
        >
          {isLoading ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </form>
  );
};

export default WorkItemLaborForm;
