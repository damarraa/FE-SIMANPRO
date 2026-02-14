import React from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Truck } from "lucide-react";
import useVehicles from "./hooks/useVehicles";
import VehiclesTable from "./components/VehiclesTable";

const VehiclesListPage = () => {
  const navigate = useNavigate();
  
  const {
    vehicles,
    pagination,
    isLoading,
    searchTerm,
    setSearchTerm,
    setPage,
    refresh,
  } = useVehicles();

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold text-[#0D47A1] mb-8 flex items-center gap-2">
        <Truck className="w-6 h-6" />
        Daftar Kendaraan & Alat Berat
      </h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0D47A1]" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-[#CFD8DC] rounded-lg text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
              placeholder="Cari kendaraan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => navigate("/vehicles/create")}
            className="bg-[#2196F3] hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg shadow-md transition-colors duration-200 flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Tambah Kendaraan Baru
          </button>
        </div>
      </div>

      <VehiclesTable
        vehicles={vehicles}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={setPage}
      />
    </div>
  );
};

export default VehiclesListPage;
