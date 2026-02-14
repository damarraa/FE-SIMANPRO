import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import useUsersByRole from "../../hooks/useUsersByRole";
import { Warehouse } from "lucide-react";
import Swal from "sweetalert2";

const WarehouseCreatePage = () => {
  const navigate = useNavigate();
  const { users: logisticUsers, isLoading: isLoadingUsers } =
    useUsersByRole("Logistic");

  const [formData, setFormData] = useState({
    warehouse_name: "",
    address: "",
    phone: "",
    pic_user_id: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      await api.post("/v1/warehouses", formData);

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Gudang baru berhasil dibuat.",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        navigate("/warehouses");
      });

      // navigate("/warehouses", {
      //   state: { message: "Gudang baru berhasil dibuat!" },
      // });
    } catch (err) {
      if (err.response && err.response.status === 422) {
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
        // setErrors({ general: "Gagal menyimpan data. Silakan coba lagi." });
        Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: err.response?.data?.message || "Terjadi kesalahan pada server.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="max-w-9xl mx-auto">
        <h1 className="text-2xl font-bold text-[#0D47A1] mb-8">
          <Warehouse className="w-6 h-6" /> Tambah Gudang Baru
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nama Gudang */}
              <div className="">
                <label
                  htmlFor="warehouse_name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nama Gudang
                </label>
                <input
                  type="text"
                  id="warehouse_name"
                  name="warehouse_name"
                  value={formData.warehouse_name}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                {errors.warehouse_name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.warehouse_name[0]}
                  </p>
                )}
              </div>

              {/* PIC Gudang (Dropdown) */}
              <div className="">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PIC Gudang
                </label>
                <select
                  name="pic_user_id"
                  value={formData.pic_user_id}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isLoadingUsers}
                >
                  <option value="">Pilih PIC</option>
                  {logisticUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
                {errors.pic_user_id && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.pic_user_id[0]}
                  </p>
                )}
              </div>

              {/* Alamat */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alamat Lengkap
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  className="block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.address[0]}
                  </p>
                )}
              </div>

              {/* Telepon */}
              <div className="">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nomor Telepon
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone[0]}</p>
                )}
              </div>
            </div>

            {/* Button */}
            <div className="flex justify-end gap-4 pt-6 mt-6 border-1">
              <button
                type="button"
                onClick={() => navigate("/warehouses")}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-6 py-2 rounded-lg"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#2196F3] hover:bg-blue-600 text-white font-medium px-6 py-2 rounded-lg disabled:bg-gray-400"
              >
                {loading ? "Menyimpan..." : "Simpan Gudang"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WarehouseCreatePage;
