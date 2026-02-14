import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Edit2,
  Trash2,
  Users,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Eye,
} from "lucide-react";
import Swal from "sweetalert2";
import { getImageUrl } from "../../../utils/image";
import { userManagementApi } from "../../../services/userManagementService";

const EmployeeTable = ({
  employees,
  isLoading,
  pagination,
  onPageChange,
  onRefresh,
  sortBy,
  sortDirection,
  onSort,
}) => {
  const navigate = useNavigate();

  const SortableHeader = ({ field, label }) => {
    const isCurrent = sortBy === field;
    return (
      <th
        className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer group hover:bg-gray-100 transition-colors select-none"
        onClick={() => onSort(field)}
      >
        <div className="flex items-center gap-1">
          {label}
          {isCurrent ? (
            sortDirection === "asc" ? (
              <ArrowUp className="w-4 h-4 text-blue-600" />
            ) : (
              <ArrowDown className="w-4 h-4 text-blue-600" />
            )
          ) : (
            <ArrowUpDown className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </div>
      </th>
    );
  };

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: "Non-aktifkan Karyawan?",
      text: `Apakah Anda yakin ingin menonaktifkan "${name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Non-aktifkan!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await userManagementApi.deleteEmployee(id);

        await Swal.fire({
          title: "Berhasil!",
          text: `Karyawan ${name} telah dinonaktifkan.`,
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        if (onRefresh) onRefresh();
      } catch (error) {
        Swal.fire({
          title: "Gagal!",
          text: "Gagal menghapus data. Pastikan user tidak sedang aktif digunakan.",
          icon: "error",
        });
      }
    }
  };

  if (isLoading)
    return (
      <div className="text-center p-8 text-gray-500">
        Memuat data karyawan...
      </div>
    );

  if (!employees || employees.length === 0) {
    return (
      <div className="text-center text-gray-600 p-12 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col items-center justify-center">
          <Users className="w-12 h-12 text-gray-300 mb-2" />
          <p>Tidak ada data karyawan ditemukan.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      <div className="overflow-x-auto flex-1">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <SortableHeader field="employee_id" label="NIK" />
              <SortableHeader field="name" label="Karyawan" />
              <SortableHeader field="role_custom" label="Role & Jabatan" />
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {employees.map((emp) => (
              <tr
                key={emp.id}
                className="hover:bg-blue-50/30 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  {emp.employee_id ? (
                    <span className="text-sm font-medium text-gray-900 font-mono px-2 py-1">
                      {emp.employee_id}
                    </span>
                  ) : (
                    <span className="text-xs text-red-500 italic bg-red-50 px-2 py-1 rounded border border-red-100">
                      Belum diatur
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={getImageUrl(emp.profile_picture)}
                      alt={emp.name}
                      className="w-10 h-10 rounded-full object-cover border border-gray-200"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          emp.name
                        )}&background=random`;
                      }}
                    />
                    <div>
                      <div className="font-medium text-gray-900">
                        {emp.name}
                      </div>
                      <div className="text-sm text-gray-500">{emp.email}</div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {emp.roles && emp.roles.length > 0 ? (
                      emp.roles.map((role, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {typeof role === "string" ? role : role.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 text-xs italic">
                        No Role
                      </span>
                    )}
                  </div>
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      emp.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {emp.is_active ? "Aktif" : "Non-Aktif"}
                  </span>
                </td>

                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => navigate(`/employees/${emp.id}`)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Detail"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => navigate(`/employees/${emp.id}/edit`)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(emp.id, emp.name)}
                      className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
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
            Menampilkan{" "}
            <span className="font-semibold">{pagination.from || 0}</span> sampai{" "}
            <span className="font-semibold">{pagination.to || 0}</span> dari{" "}
            <span className="font-semibold">{pagination.total || 0}</span>{" "}
            karyawan
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={() => onPageChange(pagination.current_page - 1)}
              disabled={pagination.current_page <= 1}
              className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
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
              className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
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

export default EmployeeTable;
