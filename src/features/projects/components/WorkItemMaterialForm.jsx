import React, { useState, useEffect } from "react";
import useMaterialsList from "../../../hooks/useMaterialsList";

const WorkItemMaterialForm = ({
  onSave,
  onCancel,
  isLoading,
  initialData = {},
}) => {
  const { materials, isLoading: isLoadingMaterials } = useMaterialsList();
  const [formData, setFormData] = useState({
    material_id: "",
    quantity: "",
    unit: "",
    unit_price: "",
  });

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        material_id: initialData.material?.id || "",
        quantity: initialData.quantity || "",
        unit: initialData.material?.unit || "",
        unit_price: initialData.unit_price || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "material_id") {
      const valueNum = parseInt(value, 10);
      const selectedMaterial = materials.find((m) => m.id === valueNum);

      setFormData((prev) => ({
        ...prev,
        material_id: value,
        unit: selectedMaterial ? selectedMaterial.unit : "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const materialIdNum = parseInt(formData.material_id, 10);

    if (isNaN(materialIdNum) || !materialIdNum) {
      console.log("Silakan pilih material terlebih dahulu.");
      return;
    }

    const selectedMaterial = materials.find((m) => m.id === materialIdNum);

    const dataForStateUpdate = {
      material_id: materialIdNum,
      quantity: parseFloat(formData.quantity),
      unit_price: parseFloat(formData.unit_price),
      material: selectedMaterial,
      unit: selectedMaterial ? selectedMaterial.unit : "",
    };

    onSave(dataForStateUpdate);
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   const selectedMaterial = materials.find(
  //     (m) => m.id === Number(formData.material_id)
  //   );

  //   const dataToSave = {
  //     quantity: formData.quantity,
  //     unit_price: formData.unit_price,
  //     material: selectedMaterial,
  //   };

  //   // Debugging
  //   // console.log("Data yang akan dikirim: ", dataToSave);
  //   onSave(dataToSave);
  // };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-gray-50 p-4 rounded-lg mb-4 border"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <label
            htmlFor="material_id"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Material
          </label>
          <select
            id="material_id"
            name="material_id"
            value={formData.material_id}
            onChange={handleChange}
            required
            disabled={isLoadingMaterials}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Pilih Material</option>
            {materials.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.sku})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="quantity"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Kuantitas
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="unit_price"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Harga Satuan
          </label>
          <input
            type="number"
            id="unit_price"
            name="unit_price"
            value={formData.unit_price}
            onChange={handleChange}
            required
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

export default WorkItemMaterialForm;
