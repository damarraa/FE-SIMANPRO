import React, { useState, useEffect } from "react";
import { Search, FileText, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useLeaveRequests from "./hooks/useLeaveRequest";
import LeavesTable from "../leaves/components/LeavesTable";

const LeaveListPage = () => {
  const navigate = useNavigate();

  const currentYear = new Date().getFullYear();
  const startYear = 2025;
  const yearOptions = Array.from(
    { length: currentYear - startYear + 1 },
    (_, i) => startYear + i
  ).reverse();

  const [filters, setFilters] = useState({
    page: 1,
    search: "",
    month: new Date().getMonth() + 1,
    year: currentYear,
    status: "",
  });

  const { leavesData, isLoading, fetchLeaves } = useLeaveRequests();

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLeaves(filters);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters, fetchLeaves]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold text-[#0D47A1] flex items-center gap-2">
          <FileText className="w-6 h-6" />
          Daftar Cuti & Izin
        </h1>

        <button
          onClick={() => navigate("/leaves/create")}
          className="bg-[#2196F3] hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg shadow-md transition-colors duration-200 flex items-center gap-2 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          Buat Pengajuan Baru
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8 p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0D47A1]" />
            <input
              type="text"
              name="search"
              className="w-full pl-10 pr-4 py-2 border border-[#CFD8DC] rounded-lg text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
              placeholder="Cari nama karyawan..."
              value={filters.search}
              onChange={handleFilterChange}
            />
          </div>

          <select
            name="month"
            value={filters.month}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-[#CFD8DC] rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent"
          >
            <option value="">Semua Bulan</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString("id-ID", { month: "long" })}
              </option>
            ))}
          </select>

          <select
            name="year"
            value={filters.year}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-[#CFD8DC] rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent"
          >
            {yearOptions.map((year) => (
               <option key={year} value={year}>{year}</option>
            ))}
          </select>

          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-[#CFD8DC] rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent"
          >
            <option value="">Semua Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      <LeavesTable
        data={leavesData.data || []}
        pagination={leavesData || {}}
        isLoading={isLoading}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default LeaveListPage;
