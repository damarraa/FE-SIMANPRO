import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Shield, Save, ArrowLeft } from "lucide-react";
import { rbacApi } from "../../services/rbacService";
import PermissionMatrix from "./component/PermissionMatrix";
import Swal from "sweetalert2";

const RoleCreatePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: "",
    permissions: [],
  });

  const [allPermissions, setAllPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setInitialLoading(true);
        const permResponse = await rbacApi.getAllPermissions();
        setAllPermissions(permResponse.data);

        if (isEditMode) {
          const roleResponse = await rbacApi.getRoleDetail(id);
          setFormData({
            name: roleResponse.data.name,
            permissions: roleResponse.data.permissions.map((p) => p.name),
          });
        }
      } catch (error) {
        console.error("Failed loading data", error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchData();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePermissionChange = (newPermissions) => {
    setFormData((prev) => ({ ...prev, permissions: newPermissions }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      if (isEditMode) {
        await rbacApi.updateRole(id, formData);
      } else {
        await rbacApi.createRole(formData);
      }

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: `Role berhasil ${isEditMode ? "diperbarui" : "dibuat"}!`,
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        navigate("/roles");
      });
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors);

        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
        });
        Toast.fire({
          icon: "warning",
          title: "Mohon periksa kembali inputan Anda.",
        });
      } else {
        // console.error("Error submitting form", err);
        Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: "Terjadi kesalahan sistem saat menyimpan Role.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="p-8 text-center text-gray-500">Memuat data role...</div>
    );
  }

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold text-[#0D47A1] mb-8 flex items-center gap-2">
        <Shield className="w-6 h-6" />
        {isEditMode ? "Edit Role & Akses" : "Tambah Role Baru"}
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="mb-8 border-b border-gray-100 pb-6">
            <div className="max-w-md">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nama Role <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Contoh: Staff Gudang, Admin Finance"
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>
              )}
              <p className="text-gray-400 text-xs mt-2">
                Nama role harus unik dan merepresentasikan jabatan atau fungsi
                pengguna.
              </p>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-end mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Hak Akses (Permissions)
              </label>
              <span className="text-xs text-gray-500">
                Total Terpilih:{" "}
                <span className="font-bold text-[#0D47A1]">
                  {formData.permissions.length}
                </span>
              </span>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300">
              <PermissionMatrix
                allPermissions={allPermissions}
                selectedPermissions={formData.permissions}
                onChange={handlePermissionChange}
              />
            </div>
            {errors.permissions && (
              <p className="text-red-500 text-xs mt-2">
                {errors.permissions[0]}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-4 mt-6 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate("/roles")}
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#2196F3] text-white px-6 py-2 rounded-lg disabled:bg-gray-400 hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-sm"
            >
              {loading ? (
                "Menyimpan..."
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Simpan Role
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RoleCreatePage;
