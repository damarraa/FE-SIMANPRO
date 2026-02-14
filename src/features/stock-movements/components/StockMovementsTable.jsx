import React from "react";
import { useNavigate } from "react-router-dom";
import {
  BuildingOffice2Icon,
  DocumentTextIcon,
  CubeIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { ChevronLeft, ChevronRight } from "lucide-react";

const StockMovementsTable = ({
  movements,
  isLoading,
  pagination,
  onPageChange,
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center p-12 bg-white rounded-xl border border-gray-100 min-h-[300px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2196F3]"></div>
        <span className="mt-4 text-gray-500 font-medium animate-pulse">
          Memuat data mutasi stok...
        </span>
      </div>
    );
  }

  if (!movements || movements.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-sm border border-dashed border-gray-300 min-h-[300px]">
        <div className="p-4 bg-gray-50 rounded-full mb-4">
          <CubeIcon className="w-12 h-12 text-gray-300" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Belum ada pergerakan stok
        </h3>
        <p className="text-sm text-gray-500 mt-1 text-center max-w-sm">
          Data transaksi barang masuk, keluar, atau penyesuaian akan muncul di
          sini.
        </p>
      </div>
    );
  }

  const renderDetailColumn = (item) => {
    if (item.type === "in") {
      return (
        <div className="flex flex-col items-start gap-1.5">
          {item.supplier ? (
            <div className="flex items-center gap-1.5 text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100 shadow-sm">
              <BuildingOffice2Icon className="w-3.5 h-3.5" />
              <span className="font-semibold text-xs tracking-wide">
                {item.supplier.name}
              </span>
            </div>
          ) : (
            <span className="text-gray-400 text-xs italic px-1">
              - Tanpa Supplier -
            </span>
          )}
          {item.remarks && (
            <div className="flex items-start gap-1 text-xs text-gray-500 ml-1">
              <DocumentTextIcon className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <span className="truncate max-w-[180px]" title={item.remarks}>
                {item.remarks}
              </span>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="flex flex-col items-start">
        {item.remarks ? (
          <div className="text-sm text-gray-700 flex items-start gap-1.5">
            <DocumentTextIcon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <span className="whitespace-normal leading-snug">
              {item.remarks}
            </span>
          </div>
        ) : (
          <span className="text-gray-300 text-xs italic ml-1">
            - Tidak ada catatan -
          </span>
        )}
      </div>
    );
  };

  const getTypeBadge = (type) => {
    const styles = {
      in: "bg-green-100 text-green-700 border-green-200",
      out: "bg-red-50 text-red-700 border-red-200",
      return: "bg-indigo-50 text-indigo-700 border-indigo-200",
      adjustment: "bg-orange-50 text-orange-700 border-orange-200",
    };

    const labels = {
      in: "Stok Masuk",
      out: "Stok Keluar",
      return: "Retur",
      adjustment: "Penyesuaian",
    };

    return (
      <span
        className={`px-2.5 py-1 text-[11px] rounded-full font-bold uppercase tracking-wide border ${
          styles[type] || styles.in
        }`}
      >
        {labels[type] || type}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      <div className="overflow-x-auto flex-1">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#2196F3]">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
              >
                Waktu
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
              >
                Material & SKU
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
              >
                Gudang
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
              >
                Detail / Referensi
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
              >
                Tipe
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
              >
                Kuantitas
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
              >
                Oleh
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {movements.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-blue-50/50 transition-colors duration-200 group"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-900">
                      {new Date(item.transaction_date).toLocaleDateString(
                        "id-ID",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </span>
                    <span className="text-xs text-gray-500 mt-0.5 font-mono">
                      {new Date(item.transaction_date).toLocaleTimeString(
                        "id-ID",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}{" "}
                      WIB
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-800 group-hover:text-blue-700 transition-colors">
                      {item.material?.name || "Nama Tidak Tersedia"}
                    </span>
                    <span className="text-[11px] font-mono text-gray-500 bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded w-fit mt-1">
                      {item.material?.sku || "NO SKU"}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {item.warehouse?.name || "-"}
                </td>
                <td className="px-6 py-4 text-sm align-middle">
                  {renderDetailColumn(item)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {getTypeBadge(item.type)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <span
                    className={`text-sm font-bold font-mono ${
                      item.type === "out" ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {item.type === "out" ? "-" : "+"}
                    {parseFloat(item.quantity).toLocaleString("id-ID")}
                  </span>
                  {item.material?.unit && (
                    <span className="text-xs text-gray-400 ml-1">
                      {item.material.unit}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                      {item.recorded_by?.name
                        ? item.recorded_by.name.charAt(0).toUpperCase()
                        : "?"}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-gray-700">
                        {item.recorded_by?.name || "Sistem"}
                      </span>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex justify-between items-center">
        <span className="text-xs text-gray-500">
          Total {movements.length} transaksi ditampilkan
        </span>
      </div>
      {!isLoading && pagination && pagination.total > 0 && (
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-500 hidden sm:block">
            Menampilkan{" "}
            <span className="font-semibold">{pagination.from || 0}</span> sampai{" "}
            <span className="font-semibold">{pagination.to || 0}</span> dari{" "}
            <span className="font-semibold">{pagination.total || 0}</span>{" "}
            transaksi
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
              disabled={pagination.current_page === pagination.last_page}
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

export default StockMovementsTable;
