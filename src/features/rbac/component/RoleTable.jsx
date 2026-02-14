import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  Edit2,
  Trash2,
  Users,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import Swal from "sweetalert2";
import { rbacApi } from "../../../services/rbacService";

const RoleTable = ({
  roles,
  isLoading,
  pagination,
  onPageChange,
  onRefresh,
  onSort,
  sortBy,
  sortDirection,
}) => {
  const navigate = useNavigate();

  const handleDelete = async (id, roleName) => {
    const result = await Swal.fire({
      title: "Hapus Role?",
      text: `Apakah Anda yakin ingin menghapus role "${roleName}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await rbacApi.deleteRole(id);

        await Swal.fire({
          title: "Berhasil!",
          text: `Role ${roleName} telah dihapus.`,
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        if (onRefresh) onRefresh();
      } catch (error) {
        Swal.fire({
          title: "Gagal!",
          text: "Gagal menghapus role. Pastikan role tidak sedang digunakan oleh user.",
          icon: "error",
        });
      }
    }
  };

  const renderSortIcon = (field) => {
    if (sortBy !== field) return null;
    return sortDirection === "asc" ? (
      <ArrowUp className="w-4 h-4 ml-1" />
    ) : (
      <ArrowDown className="w-4 h-4 ml-1" />
    );
  };

  if (isLoading)
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="flex flex-col items-center justify-center text-gray-500 animate-pulse">
          <Shield className="w-8 h-8 mb-2 opacity-50" />
          <p>Memuat data role...</p>
        </div>
      </div>
    );

  if (!roles || roles.length === 0) {
    return (
      <div className="text-center text-gray-600 p-12 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col items-center justify-center">
          <Shield className="w-12 h-12 text-gray-300 mb-2" />
          <p>Belum ada role yang dibuat.</p>
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
              <th
                onClick={() => onSort && onSort("hierarchy")}
                className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors group select-none"
              >
                <div className="flex items-center">
                  Nama Role
                  {renderSortIcon("hierarchy")}
                </div>
              </th>

              <th
                onClick={() => onSort && onSort("users_count")}
                className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors group select-none"
              >
                <div className="flex items-center">
                  Jumlah User
                  {renderSortIcon("users_count")}
                </div>
              </th>

              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {roles.map((role) => (
              <tr
                key={role.id}
                className="hover:bg-blue-50/30 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{role.name}</div>
                  {role.name === "Super Admin" && (
                    <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full mt-1 inline-block border border-green-200">
                      System Default
                    </span>
                  )}
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-gray-600 bg-gray-50 w-fit px-3 py-1 rounded-lg border border-gray-100">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium">
                      {role.users_count || 0} Users
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => navigate(`/roles/${role.id}/edit`)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                      title="Edit Role"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    {role.name !== "Super Admin" && (
                      <button
                        onClick={() => handleDelete(role.id, role.name)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                        title="Hapus Role"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
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
            <span className="font-semibold text-gray-700">
              {pagination.from || 0}
            </span>{" "}
            sampai{" "}
            <span className="font-semibold text-gray-700">
              {pagination.to || 0}
            </span>{" "}
            dari{" "}
            <span className="font-semibold text-gray-700">
              {pagination.total || 0}
            </span>{" "}
            role
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

            <span className="text-sm text-gray-600 font-medium px-2 sm:hidden">
              Hal {pagination.current_page} / {pagination.last_page}
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

export default RoleTable;
