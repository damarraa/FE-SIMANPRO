import React, { useState, useEffect } from "react";
import { Search, ListChecks, Plus, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAttendanceList from "../attendance/hooks/useAttendanceList";
import AttendancesTable from "./components/AttendancesTable";

const AttendanceListPage = () => {
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
    year: new Date().getFullYear(),
  });

  const { attendanceData, isLoading, fetchAttendances } = useAttendanceList();

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAttendances(filters);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters, fetchAttendances]);

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
        <h1 className="text-2xl font-bold text-[#0D47A1] mb-8 flex items-center gap-2">
          <ListChecks className="w-6 h-6" />
          Monitoring Absensi
        </h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <button
            onClick={() => navigate("/attendance/create")}
            className="bg-white border border-[#2196F3] text-[#2196F3] hover:bg-blue-50 font-medium px-4 py-2 rounded-lg shadow-sm transition-colors duration-200 flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Camera className="w-4 h-4" />
            Absen Sekarang
          </button>

          <button
            onClick={() => navigate("/leaves/create")}
            className="bg-[#2196F3] hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg shadow-md transition-colors duration-200 flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Buat Pengajuan Baru
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8 p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0D47A1]" />
            <input
              type="text"
              name="search"
              placeholder="Cari karyawan..."
              value={filters.search}
              onChange={handleFilterChange}
              className="w-full pl-10 pr-4 py-2 border border-[#CFD8DC] rounded-lg text-[#0D47A1] focus:ring-2 focus:ring-[#2196F3] focus:outline-none"
            />
          </div>

          <select
            name="month"
            value={filters.month}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-[#CFD8DC] rounded-lg text-gray-700 focus:ring-2 focus:ring-[#2196F3] focus:outline-none"
          >
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
            className="w-full px-3 py-2 border border-[#CFD8DC] rounded-lg text-gray-700 focus:ring-2 focus:ring-[#2196F3] focus:outline-none"
          >
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      <AttendancesTable
        data={attendanceData.data || []}
        pagination={attendanceData || {}}
        isLoading={isLoading}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default AttendanceListPage;
