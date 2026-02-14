import React from "react";
import { CubeIcon } from "@heroicons/react/24/outline";

const InventoryStocksTable = ({ stocks, isLoading }) => {
  if (isLoading) {
    return (
      <div className="mt-8 p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
        <p className="text-gray-500">Memuat data stok material...</p>
      </div>
    );
  }

  if (!stocks || stocks.length === 0) {
    return (
      <div className="mt-8">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <CubeIcon className="w-5 h-5 text-blue-600" /> Stok Material
        </h3>
        <div className="p-8 text-center bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500">Belum ada material di gudang ini.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <CubeIcon className="w-5 h-5 text-blue-600" /> Stok Material
      </h3>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                  Nama Material
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                  Stok
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                  Min. Stok
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {stocks.map((stock) => (
                <tr key={stock.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {stock.material?.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                    {stock.material?.sku}
                  </td>
                  <td
                    className={`px-6 py-4 text-sm font-bold ${
                      parseFloat(stock.current_stock) <=
                      parseFloat(stock.min_stock)
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {parseFloat(stock.current_stock)} {stock.material?.unit}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {parseFloat(stock.min_stock)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryStocksTable;
