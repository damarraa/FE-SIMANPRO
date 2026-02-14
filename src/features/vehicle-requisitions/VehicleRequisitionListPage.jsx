import React from "react";
import { useNavigate } from "react-router-dom";
import useVehicleRequisitions from "./hooks/useVehicleRequisitions";
import VehicleRequisitionsTable from "./components/VehicleRequisitionsTable";
import { Truck, Plus, Search } from "lucide-react";

const VehicleRequisitionListPage = () => {
  const navigate = useNavigate();
  const { data, isLoading, searchTerm, setSearchTerm } =
    useVehicleRequisitions();

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold text-[#0D47A1] mb-8 flex items-center gap-2">
        <Truck className="w-6 h-6" />
        Daftar Permintaan Kendaraan (VR)
      </h1>

      <div className="bg-white rounded-xl shadow-sm border mb-8 p-4">
        <div className="flex justify-between items-center">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari No. VR atau Proyek..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
          <button
            onClick={() => navigate("/vehicle-requisitions/create")}
            className="bg-[#2196F3] text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Buat VR Baru
          </button>
        </div>
      </div>

      <VehicleRequisitionsTable
        requisitions={data?.data}
        isLoading={isLoading}
      />
    </div>
  );
};

export default VehicleRequisitionListPage;
