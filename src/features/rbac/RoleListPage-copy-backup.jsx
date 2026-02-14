import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Plus, Edit2, Trash2, Users } from "lucide-react";
import { rbacApi } from "../../services/rbacService";

const RoleListPage = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await rbacApi.getRoles();
      setRoles(response.data);
    } catch (error) {
      console.error("Gagal mengambil data roles", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleDelete = async (id, roleName) => {
    if (
      window.confirm(`Apakah Anda yakin ingin menghapus role "${roleName}"?`)
    ) {
      try {
        await rbacApi.deleteRole(id);
        fetchRoles();
      } catch (error) {
        alert(
          "Gagal menghapus role. Pastikan role tidak sedang digunakan oleh user."
        );
      }
    }
  };

  return (
    <div className="w-full">
      {/* Header Page */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0D47A1] flex items-center gap-2">
            <Shield className="w-7 h-7" />
            Manajemen Role & Akses
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Atur peran pengguna dan batasan hak akses aplikasi.
          </p>
        </div>

        <button
          onClick={() => navigate("/roles/create")}
          className="bg-[#2196F3] text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Tambah Role Baru
        </button>
      </div>

      {/* Content Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Memuat data role...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-700 text-sm uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Nama Role</th>
                  <th className="px-6 py-4 font-semibold">Jumlah User</th>
                  <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {roles.map((role) => (
                  <tr
                    key={role.id}
                    className="hover:bg-blue-50/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {role.name}
                      </div>
                      {role.name === "Super Admin" && (
                        <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full mt-1 inline-block">
                          System Default
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{role.users_count || 0} Users</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => navigate(`/roles/${role.id}/edit`)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Edit Role"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {/* Super Admin biasanya diproteksi tidak boleh dihapus */}
                        {role.name !== "Super Admin" && (
                          <button
                            onClick={() => handleDelete(role.id, role.name)}
                            className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
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

            {roles.length === 0 && (
              <div className="p-8 text-center text-gray-400">
                Belum ada role yang dibuat.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleListPage;
