import React from "react";
import { useNavigate } from "react-router-dom";
import useToolRequisitions from "./hooks/useToolRequisitions";
import ToolRequisitionsTable from "./components/ToolRequisitionsTable";
import { Wrench, Plus, Search } from "lucide-react";

const ToolRequisitionListPage = () => {
  const navigate = useNavigate();
  const { data, isLoading, searchTerm, setSearchTerm } = useToolRequisitions();

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold text-[#0D47A1] mb-8 flex items-center gap-2">
        <Wrench className="w-6 h-6" />
        Daftar Permintaan Alat
      </h1>

      <div className="bg-white rounded-xl shadow-sm border mb-8 p-4">
        <div className="flex justify-between items-center">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari No. Peminjaman Alat atau Proyek..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
          <button
            onClick={() => navigate("/tool-requisitions/create")}
            className="bg-[#2196F3] text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Buat Peminjaman Alat Baru
          </button>
        </div>
      </div>

      <ToolRequisitionsTable requisitions={data?.data} isLoading={isLoading} />
    </div>
  );
};

export default ToolRequisitionListPage;
