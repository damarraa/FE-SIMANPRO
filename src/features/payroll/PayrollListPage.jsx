import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import usePayroll from "./hooks/usePayrolls";
import PayrollsTable from "./components/PayrollsTable";

export default function PayrollListPage() {
  const { payrollsData, isLoading, fetchPayrolls, removePayroll } =
    usePayroll();

  useEffect(() => {
    fetchPayrolls();
  }, [fetchPayrolls]);

  const handleDelete = async (id) => {
    const success = await removePayroll(id);
    if (success) {
      fetchPayrolls({ page: payrollsData.current_page });
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= payrollsData.last_page) {
      fetchPayrolls({ page: newPage });
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Manajemen Payroll
          </h1>
          <p className="text-sm text-gray-600">
            Mengelola gaji dan periode penggajian karyawan.
          </p>
        </div>
        <Link
          to="/payrolls/create"
          className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow transition-colors flex items-center"
        >
          <span>+ Tambah Data</span>
        </Link>
      </div>

      <PayrollsTable
        data={payrollsData.data}
        isLoading={isLoading}
        onDelete={handleDelete}
      />

      {!isLoading && payrollsData.total > 0 && (
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-600">
            Showing <span className="font-medium">{payrollsData.from}</span> to{" "}
            <span className="font-medium">{payrollsData.to}</span> of{" "}
            <span className="font-medium">{payrollsData.total}</span> results
          </p>

          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(payrollsData.current_page - 1)}
              disabled={payrollsData.current_page === 1}
              className={`px-3 py-1 rounded border ${
                payrollsData.current_page === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(payrollsData.current_page + 1)}
              disabled={payrollsData.current_page === payrollsData.last_page}
              className={`px-3 py-1 rounded border ${
                payrollsData.current_page === payrollsData.last_page
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
