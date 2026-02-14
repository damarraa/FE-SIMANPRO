import React from "react";
import { useNavigate } from "react-router-dom";
import usePurchaseOrders from "./hooks/usePurchaseOrders";
import PurchaseOrdersTable from "./components/PurchaseOrdersTable";
import { ShoppingBag, Search, Plus } from "lucide-react";

const PurchaseOrderListPage = () => {
  const navigate = useNavigate();
  const { data, isLoading, searchTerm, setSearchTerm } = usePurchaseOrders();

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold text-[#0D47A1] mb-8 flex items-center gap-2">
        <ShoppingBag className="w-6 h-6" />
        Daftar Purchase Order (PO)
      </h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0D47A1]" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-[#CFD8DC] rounded-lg"
              placeholder="Cari No. PO atau Supplier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => navigate("/purchase-orders/create")}
            className="bg-[#2196F3] hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Buat PO Baru
          </button>
        </div>
      </div>

      <PurchaseOrdersTable purchaseOrders={data?.data} isLoading={isLoading} />
    </div>
  );
};

export default PurchaseOrderListPage;
