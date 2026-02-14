import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Wrench, ImageIcon } from "lucide-react";
import Swal from "sweetalert2";
import { getImageUrl, DEFAULT_TOOL_IMAGE } from "../../../utils/image";

const ConditionBadge = ({ condition }) => {
  const color = {
    Baik: "bg-green-100 text-green-800 border-green-200",
    "Perlu Perbaikan": "bg-yellow-100 text-yellow-800 border-yellow-200",
    Rusak: "bg-red-100 text-red-800 border-red-200",
  };
  return (
    <span
      className={`px-2.5 py-0.5 text-xs rounded-full font-medium border ${
        color[condition] || "bg-gray-100 text-gray-800 border-gray-200"
      }`}
    >
      {condition}
    </span>
  );
};

const ToolsTable = ({ tools, isLoading, pagination, onPageChange }) => {
  const navigate = useNavigate();

  const handleImagePreview = (imageUrl, name) => {
    Swal.fire({
      imageUrl: imageUrl,
      imageAlt: name,
      title: name,
      showConfirmButton: false,
      showCloseButton: true,
      width: "auto",
      padding: "1rem",
      backdrop: `rgba(0,0,0,0.8)`,
    });
  };

  if (isLoading)
    return (
      <div className="text-center p-8 text-gray-500">Memuat data alat...</div>
    );

  if (!tools || tools.length === 0) {
    return (
      <div className="text-center text-gray-600 p-12 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col items-center justify-center">
          <Wrench className="w-12 h-12 text-gray-300 mb-2" />
          <p>Tidak ada data alat ditemukan.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col">
      <div className="overflow-x-auto flex-1">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#2196F3]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Foto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Nama Alat
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Kode
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Merek
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Kondisi
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tools.map((item, index) => {
              let rawPath = item.picture_path;
              if (Array.isArray(rawPath))
                rawPath = rawPath.length > 0 ? rawPath[0] : null;

              const isValidString =
                typeof rawPath === "string" && rawPath.trim() !== "";
              const imageUrl = isValidString ? getImageUrl(rawPath) : null;
              const rowNumber =
                index +
                1 +
                ((pagination?.current_page || 1) - 1) *
                  (pagination?.per_page || 10);

              return (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {rowNumber}
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-14 w-14 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200 group relative shadow-sm">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={item.name}
                          onClick={() =>
                            handleImagePreview(imageUrl, item.name)
                          }
                          onError={(e) => {
                            e.target.onerro = null;
                            e.target.src = DEFAULT_TOOL_IMAGE;
                          }}
                          className="h-full w-full object-cover cursor-pointer hover:scale-110 transition-transform duration-200"
                        />
                      ) : (
                        <ImageIcon className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                    {item.tool_code}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.brand}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <ConditionBadge condition={item.condition} />
                  </td>
                  <td className="px-6 py-4 text-sm text-right">
                    <Link
                      to={`/tools/${item.id}`}
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

      {!isLoading && pagination && pagination.current_page && (
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
              {pagination.last_page ? ` dari ${pagination.last_page}` : ""}
            </span>

            <button
              onClick={() => onPageChange(pagination.current_page + 1)}
              disabled={
                pagination.current_page >= pagination.last_page ||
                pagination.total === 0
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

export default ToolsTable;
