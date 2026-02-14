import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import usePayroll from "./hooks/usePayrolls";
import useUsersList from "../../hooks/useUsersList";
import Select from "react-select";
import { ArrowLeftIcon, CalculatorIcon } from "@heroicons/react/24/outline";

export default function PayrollCreatePage() {
  const { createPayroll, isLoading } = usePayroll();
  const { users, isLoading: isLoadingUsers } = useUsersList();

  const [formData, setFormData] = useState({
    user_id: "",
    period_start: "",
    period_end: "",
    base_salary: "",
    total_allowance: 0,
    total_deduction: 0,
    payment_date: "",
    status: "Draft",
  });

  const [estimatedNet, setEstimatedNet] = useState(0);

  const userOptions = useMemo(() => {
    return users.map((user) => ({
      value: user.id,
      label: `${user.name} ${user.employee_id ? `(${user.employee_id})` : ""}`,
      base_salary: user.base_salary,
    }));
  }, [users]);

  const selectedUserOption =
    userOptions.find((opt) => opt.value === formData.user_id) || null;

  const formatIDR = (value) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);

  useEffect(() => {
    const base = parseFloat(formData.base_salary) || 0;
    const allowance = parseFloat(formData.total_allowance) || 0;
    const deduction = parseFloat(formData.total_deduction) || 0;
    setEstimatedNet(base + allowance - deduction);
  }, [
    formData.base_salary,
    formData.total_allowance,
    formData.total_deduction,
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUserChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      user_id: selectedOption ? selectedOption.value : "",
      base_salary: selectedOption?.base_salary || prev.base_salary,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      base_salary: parseFloat(formData.base_salary),
      total_allowance: parseFloat(formData.total_allowance),
      total_deduction: parseFloat(formData.total_deduction),
      net_salary: estimatedNet,
    };
    await createPayroll(payload);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center gap-4">
        <Link
          to="/payrolls"
          className="p-2 rounded-full hover:bg-gray-200 transition-colors"
        >
          <ArrowLeftIcon className="w-6 h-6 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Buat Payroll Baru
          </h1>
          <p className="text-sm text-gray-500">
            Tambahkan data penggajian baru untuk karyawan.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
              Karyawan & Periode
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID Karyawan (User ID) <span className="text-red-500">*</span>
                </label>
                <Select
                  options={userOptions}
                  value={selectedUserOption}
                  onChange={handleUserChange}
                  isLoading={isLoadingUsers}
                  placeholder="Cari nama karyawan atau NIP..."
                  isClearable
                  isSearchable
                  className="text-gray-800"
                  required
                />
                {!formData.user_id && (
                  <input
                    tabIndex={-1}
                    autoComplete="off"
                    style={{ opacity: 0, height: 0, position: "absolute" }}
                    required
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Awal Periode <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="period_start"
                  value={formData.period_start}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Akhir Periode <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="period_end"
                  value={formData.period_end}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
              Komponen Gaji
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gaji Pokok (IDR) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="base_salary"
                  value={formData.base_salary}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Tunjangan (IDR)
                </label>
                <input
                  type="number"
                  name="total_allowance"
                  value={formData.total_allowance}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Potongan (IDR)
                </label>
                <input
                  type="number"
                  name="total_deduction"
                  value={formData.total_deduction}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CalculatorIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estimasi Gaji Bersih</p>
                  <p className="text-xs text-gray-500">
                    Gaji Pokok + Tunjangan - Potongan
                  </p>
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-700">
                {formatIDR(estimatedNet)}
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
              Status & Pembayaran
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Draft">Draft</option>
                  <option value="Processed">Processed</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Pembayaran (Opsional)
                </label>
                <input
                  type="date"
                  name="payment_date"
                  value={formData.payment_date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Link
              to="/payrolls"
              className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-2.5 rounded-lg text-white font-medium transition-colors ${
                isLoading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
              }`}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Menyimpan...
                </span>
              ) : (
                "Simpan Payroll"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
