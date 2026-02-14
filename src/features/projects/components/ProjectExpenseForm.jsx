import React, { useEffect, useState } from "react";
import CurrencyInput from "react-currency-input-field";

const ProjectExpenseForm = ({
  onSave,
  onCancel,
  isLoading,
  initialData = {},
}) => {
  const [formData, setFormData] = useState({
    expense_date: new Date().toISOString().slice(0, 10),
    amount: "",
    description: "",
  });

  useEffect(() => {
    if (initialData && initialData.id) {
      setFormData({
        expense_date: initialData.expense_date.slice(0, 10) || "",
        amount: initialData.amount || "",
        description: initialData.description || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleCurrencyChange = (value, name) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const isEditMode = initialData && initialData.id;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-gray-50 p-4 rounded-lg mb-4 border"
    >
      <h4 className="font-medium text-gray-800">
        {isEditMode ? "Edit Biaya Lain-lain" : "Tambah Biaya Lain-lain"}
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="">
          <label
            htmlFor="expense_date"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tanggal
          </label>
          <input
            type="date"
            name="expense_date"
            id="expense_date"
            value={formData.expense_date}
            onChange={handleChange}
            required
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-md text-gray-900 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="">
          <label
            htmlFor=""
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Jumlah Biaya
          </label>
          <CurrencyInput
            id="amount"
            name="amount"
            placeholder="Rp 0"
            value={formData.amount}
            decimalsLimit={2}
            prefix="Rp "
            groupSeparator="."
            decimalSeparator=","
            onValueChange={handleCurrencyChange}
            required
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
          />
          
          {/* <input
            type="number"
            name="amount"
            id="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            className="block w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
          /> */}
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor=""
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Deskripsi
          </label>
          <textarea
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="2"
            className="block w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>

        <div className="md:col-span-2 flex w-full justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded-lg"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:bg-gray-400"
          >
            {isLoading
              ? "Menyimpan..."
              : isEditMode
              ? "Simpan Perubahan"
              : "Simpan"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProjectExpenseForm;
