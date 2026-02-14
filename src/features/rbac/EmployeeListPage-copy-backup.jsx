import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit2, Trash2, Search, Users, AlertCircle } from "lucide-react";
import { userManagementApi } from "../../services/userManagementService";
import { getImageUrl } from "../../utils/image";

const EmployeeListPage = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  const [error, setError] = useState(null);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await userManagementApi.getEmployees(1, search);
      // console.log("API Response:", response);
      const dataList = response.data.data || response.data;

      setEmployees(Array.isArray(dataList) ? dataList : []);
    } catch (error) {
      console.error("Gagal mengambil data karyawan", error);
      setError("Gagal memuat data. Cek koneksi server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchEmployees();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [search]);

  const handleDelete = async (id, name) => {
    if (
      window.confirm(
        `Apakah Anda yakin ingin menonaktifkan karyawan "${name}"?`
      )
    ) {
      try {
        await userManagementApi.deleteEmployee(id);
        fetchEmployees();
      } catch (error) {
        alert(
          "Gagal menghapus data. Pastikan user tidak sedang aktif digunakan."
        );
      }
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0D47A1] flex items-center gap-2">
            <Users className="w-7 h-7" />
            Manajemen Karyawan
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Kelola data staff dan hak akses aplikasi (Role).
          </p>
        </div>

        <button
          onClick={() => navigate("/employees/create")}
          className="bg-[#2196F3] text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Tambah Karyawan
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Cari nama atau email karyawan..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Memuat data...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-700 text-sm uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Karyawan</th>
                  <th className="px-6 py-4 font-semibold">Role & Jabatan</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {employees.length > 0 ? (
                  employees.map((emp) => (
                    <tr
                      key={emp.id}
                      className="hover:bg-blue-50/30 transition-colors"
                    >
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
                            <div className="text-sm text-gray-500">
                              {emp.email}
                            </div>
                          </div>
                        </div>
                      </td>

                
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex flex-wrap gap-1">
                            {emp.roles && emp.roles.length > 0 ? (
                              emp.roles.map((role, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                >
                                  {role}
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-400 text-xs italic">
                                No Role
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        {emp.is_active ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Aktif
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Non-Aktif
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() =>
                              navigate(`/employees/${emp.id}/edit`)
                            }
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Edit & Assign Role"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(emp.id, emp.name)}
                            className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                            title="Non-aktifkan"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-8 text-center text-gray-500 italic"
                    >
                      Tidak ada data karyawan ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeListPage;
