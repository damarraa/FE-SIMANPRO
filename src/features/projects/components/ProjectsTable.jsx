import React from "react";
import { Link } from "react-router-dom";
import { usePermission } from "../../../hooks/usePermission";
import { ChevronLeft, ChevronRight, Briefcase } from "lucide-react";

const StatusBadge = ({ status }) => {
  const color = {
    "On-Progress": "bg-blue-100 text-blue-800",
    Completed: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
    Pending: "bg-yellow-100 text-yellow-800",
  };
  return (
    <span
      className={`px-2 py-1 text-xs rounded-full font-medium ${color[status]} || 'bg-gray-100 text-gray-800`}
    >
      {status}
    </span>
  );
};

const ProjectsTable = ({ projects, isLoading, pagination, onPageChange, refresh }) => {
  const { can } = usePermission();

  if (isLoading)
    return (
      <div className="text-center p-8 text-gray-500">Memuat data proyek...</div>
    );

  if (!projects || projects.length === 0) {
    return (
      <div className="text-center text-gray-600 p-12 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col items-center justify-center">
          <Briefcase className="w-12 h-12 text-gray-300 mb-2" />
          <p>Tidak ada data proyek.</p>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
                No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
                Nama Proyek
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
                Klien
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
                Project Manager
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
                Tanggal Mulai
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {projects.map((item, index) => {
              const rowNumber =
                index +
                1 +
                ((pagination?.current_page || 1) - 1) *
                  (pagination?.per_page || 10);
              return (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {rowNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.job_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.client}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.project_manager}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(item.start_date).toLocaleDateString("id-ID")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {/* {can("update::project") && ( */}
                    <Link
                      to={`/projects/${item.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Detail
                    </Link>
                    {/* )} */}
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

export default ProjectsTable;
