import React from "react";
import { useNavigate, Link } from "react-router-dom";
import useStockMovements from "./hooks/useStockMovements";
import StockMovementsTable from "./components/StockMovementsTable";
import { Plus, Search, History } from "lucide-react";

const StockMovementListPage = () => {
  const navigate = useNavigate();

  const {
    movements,
    pagination,
    isLoading,
    searchTerm,
    setSearchTerm,
    setPage,
  } = useStockMovements();

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold text-[#0D47A1] mb-8 flex items-center gap-2">
        <History className="w-6 h-6" />
        Jurnal Pergerakan Stok
      </h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center  gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0D47A1]" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-[#CFD8DC] rounded-lg"
              placeholder="Cari material..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => navigate("/stock-movements/create")}
            className="bg-[#2196F3] hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Catat Pergerakan Baru
          </button>
        </div>
      </div>

      <StockMovementsTable
        movements={movements}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={setPage}
      />
    </div>
  );
};

export default StockMovementListPage;
