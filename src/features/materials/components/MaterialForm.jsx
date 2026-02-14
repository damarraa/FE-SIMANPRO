import React from "react";
import useSuppliers from "../../../hooks/useSuppliers";

const MaterialForm = ({ formData, setFormData, errors, isLoading }) => {
  const { suppliers } = useSuppliers();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.files[0] }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* SKU */}
      <div className="">
        <label htmlFor="sku">SKU (Kode Unik Material)</label>
        <input
          id="sku"
          name="sku"
          value={formData.sku}
          onChange={handleChange}
          required
          className="w-full mt-1"
        />
      </div>
    </div>
  );
};
