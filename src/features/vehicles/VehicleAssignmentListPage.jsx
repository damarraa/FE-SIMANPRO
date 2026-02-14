import React from "react";
import { useNavigate } from "react-router-dom";
import useAllVehicleAssignments from "./hooks/useAllVehicleAssignments";
import VehicleAssignmentsTable from "./components/VehicleAssignmentsTable";
import { ClipboardCheck, Search, Plus } from "lucide-react";

const VehicleAssignmentListPage = () => {
  const navigate = useNavigate();

  const {
    assignments,
    pagination,
    isLoading,
    searchTerm,
    setSearchTerm,
    setPage,
  } = useAllVehicleAssignments();

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold text-[#0D47A1] mb-8 flex items-center gap-2">
        <ClipboardCheck className="w-6 h-6" />
        Riwayat Penugasan Semua Kendaraan
      </h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8 p-4">
        <div className="flex justify-between items-center">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari kendaraan atau proyek..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>

          {/* <button onClick={() => navigate('/vehicle-assignments/create')} className="bg-[#2196F3] text-white px-4 py-2 rounded-lg flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Buat Penugasan
                    </button> */}
        </div>
      </div>

      <VehicleAssignmentsTable
        assignments={assignments}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={setPage}
      />
    </div>
  );
};

export default VehicleAssignmentListPage;
