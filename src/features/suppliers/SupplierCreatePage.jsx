import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2 } from "lucide-react";
import api from "../../api";
import Swal from "sweetalert2";

const SupplierCreatePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    pic: "",
    phone: "",
    address: "",
    notes: "",
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

    const dataToSubmit = new FormData();
    Object.keys(formData).forEach((key) => {
      dataToSubmit.append(key, formData[key] || "");
    });

    try {
      await api.post("/v1/suppliers", dataToSubmit, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data Supplier baru berhasil disimpan.",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        navigate("/suppliers");
      });
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
        setErrors({ general: "Gagal menyimpan data. Silakan coba lagi." });
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
          <Building2 className="w-6 h-6" />
          Tambah Supplier Baru
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nama Supplier */}
              <div className="">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nama Supplier
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="..."
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>
                )}
              </div>

              {/* PIC */}
              <div className="">
                <label
                  htmlFor="pic"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  PIC (Person In Charge)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="pic"
                    name="pic"
                    value={formData.pic}
                    onChange={handleChange}
                    placeholder="..."
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {errors.pic && (
                  <p className="text-red-500 text-xs mt-1">{errors.pic[0]}</p>
                )}
              </div>

              {/* Telepon */}
              <div className="">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nomor Telepon <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+62 ..."
                  className="block w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone[0]}</p>
                )}
              </div>

              <div className="hidden md:block"></div>

              {/* Alamat */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alamat Lengkap
                </label>
                <textarea
                  id="address"
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

              {/* Catatan */}
              <div className="md:col-span-2">
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Catatan Tambahan
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="2"
                  placeholder="Informasi tambahan mengenai supplier ini..."
                  className="block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
                {errors.notes && (
                  <p className="text-red-500 text-xs mt-1">{errors.notes[0]}</p>
                )}
              </div>
            </div>

            {/* Tombol Aksi */}
            <div className="flex justify-end gap-4 mt-6 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate("/suppliers")}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-6 py-2 rounded-lg"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#2196F3] hover:bg-blue-600 text-white font-medium px-6 py-2 rounded-lg disabled:bg-gray-400"
              >
                {loading ? "Menyimpan..." : "Simpan Supplier"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupplierCreatePage;
