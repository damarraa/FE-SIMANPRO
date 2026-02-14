import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Warehouse } from "lucide-react";

const WarehouseTable = ({
  warehouses,
  isLoading,
  pagination,
  onPageChange,
}) => {
  const navigate = useNavigate();

  if (isLoading)
    return (
      <div className="text-center p-8 text-gray-500">Memuat data gudang...</div>
    );

  if (!warehouses || warehouses.length === 0) {
    return (
      <div className="text-center text-gray-600 p-12 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col items-center justify-center">
          <Warehouse className="w-12 h-12 text-gray-300 mb-2" />
          <p>Tidak ada data gudang ditemukan.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      <div className="overflow-x-auto flex-1">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#2196F3]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Nama Gudang
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Alamat
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                PIC Gudang
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Kontak
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {warehouses.map((item, index) => {
              const rowNumber =
                index +
                1 +
                ((pagination?.current_page || 1) - 1) *
                  (pagination?.per_page || 10);
              return (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {rowNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {item.warehouse_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.pic?.name || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.phone || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right font-medium">
                    <Link
                      to={`/warehouses/${item.id}`}
                      className="bg-blue-100 text-blue-800 hover:bg-blue-200 font-semibold px-4 py-2 text-xs rounded-full transition-colors"
                    >
                      Detail / Edit
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {!isLoading && pagination && pagination.total > 0 && (
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-500 hidden sm:block">
            Menampilkan{" "}
            <span className="font-semibold">{pagination.from || 0}</span> sampai{" "}
            <span className="font-semibold">{pagination.to || 0}</span> dari{" "}
            <span className="font-semibold">{pagination.total || 0}</span> data
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={() => onPageChange(pagination.current_page - 1)}
              disabled={pagination.current_page <= 1}
              className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Sebelumnya</span>
            </button>

            <span className="text-sm text-gray-600 font-medium px-2">
              Halaman {pagination.current_page}
            </span>

            <button
              onClick={() => onPageChange(pagination.current_page + 1)}
              disabled={
                pagination.current_page === pagination.last_page ||
                !pagination.next_page_url
              }
              className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <span className="hidden sm:inline">Selanjutnya</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WarehouseTable;
