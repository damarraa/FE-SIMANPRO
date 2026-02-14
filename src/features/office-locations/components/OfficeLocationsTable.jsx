import React from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Building,
  Eye,
  Trash2,
} from "lucide-react";

const OfficeLocationsTable = ({
  data,
  pagination,
  isLoading,
  onPageChange,
  onDelete,
}) => {
  if (isLoading)
    return <div className="text-center p-8 text-gray-500">Memuat data...</div>;
  if (!data || data.length === 0)
    return (
      <div className="text-center p-8 text-gray-500">
        Belum ada data lokasi.
      </div>
    );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      <div className="overflow-x-auto flex-1">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#2196F3]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
                Nama Kantor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
                Alamat
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
                Koordinat
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
                Radius
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <Building size={18} />
                    </div>
                    <span className="font-medium text-gray-900">
                      {item.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                  {item.address}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  <a
                    href={`https://www.google.com/maps?q=${item.latitude},${item.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:underline"
                  >
                    <MapPin size={14} /> Lihat Peta
                  </a>
                  <div className="text-xs text-gray-400 mt-1">
                    {item.latitude}, {item.longitude}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    {item.radius} Meter
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <Link
                      to={`/office-locations/${item.id}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      <Eye size={18} />
                    </Link>
                    <button
                      onClick={() => onDelete(item.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!isLoading && pagination && pagination.total > 0 && (
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-500 hidden sm:block">
            Hal {pagination.current_page} dari {pagination.last_page}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(pagination.current_page - 1)}
              disabled={pagination.current_page <= 1}
              className="p-2 border rounded hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => onPageChange(pagination.current_page + 1)}
              disabled={pagination.current_page === pagination.last_page}
              className="p-2 border rounded hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfficeLocationsTable;