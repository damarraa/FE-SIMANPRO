import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wrench, Camera } from "lucide-react";
import api from "../../api";
import Swal from "sweetalert2";

const ToolCreatePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    tool_code: "",
    brand: "",
    serial_number: "",
    purchase_date: "",
    unit_price: "",
    condition: "Baik",
    warranty_period: "",
    picture: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, [e.target.name]: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const dataToSubmit = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null) {
        dataToSubmit.append(key, formData[key]);
      }
    });

    try {
      await api.post("/v1/tools", dataToSubmit, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Alat baru berhasil ditambahkan.",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        navigate("/tools");
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
        // setErrors({ general: "Gagal menyimpan data. Silakan coba lagi." });
        Swal.fire({
          icon: "error",
          title: "Gagal!",
          text:
            err.response?.data?.message ||
            "Terjadi kesalahan saat menyimpan data.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="max-w-9xl mx-auto">
        <h1 className="text-2xl font-bold text-[#0D47A1] mb-8 flex items-center gap-2">
          <Wrench className="w-6 h-6" />
          Tambah Alat Baru
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* --- Kolom Kiri --- */}
              <div className="space-y-6">
                {/* Nama Alat */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nama Alat <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    onChange={handleChange}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Contoh: Mesin Bor Bosch"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.name[0]}
                    </p>
                  )}
                </div>

                {/* Kode Alat */}
                <div>
                  <label
                    htmlFor="tool_code"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Kode Alat <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="tool_code"
                    name="tool_code"
                    onChange={handleChange}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Contoh: BOR-BOSCH-001"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Kode ini akan digunakan sebagai nama file gambar.
                  </p>
                  {errors.tool_code && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.tool_code[0]}
                    </p>
                  )}
                </div>

                {/* Merek & Serial */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="brand"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Merek
                    </label>
                    <input
                      type="text"
                      id="brand"
                      name="brand"
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="serial_number"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Serial Number
                    </label>
                    <input
                      type="text"
                      id="serial_number"
                      name="serial_number"
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                  </div>
                </div>
              </div>

              {/* --- Kolom Kanan --- */}
              <div className="space-y-6">
                {/* Harga & Tanggal */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="purchase_date"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Tgl Pembelian
                    </label>
                    <input
                      type="date"
                      id="purchase_date"
                      name="purchase_date"
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="unit_price"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Harga Beli
                    </label>
                    <input
                      type="number"
                      id="unit_price"
                      name="unit_price"
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                  </div>
                </div>

                {/* Kondisi & Garansi */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="condition"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Kondisi
                    </label>
                    <select
                      id="condition"
                      name="condition"
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    >
                      <option value="Baik">Baik</option>
                      <option value="Perlu Perbaikan">Perlu Perbaikan</option>
                      <option value="Rusak">Rusak</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="warranty_period"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Masa Garansi
                    </label>
                    <input
                      type="date"
                      id="warranty_period"
                      name="warranty_period"
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                  </div>
                </div>

                {/* Foto Input dengan Preview */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Foto Alat
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md relative hover:bg-gray-50 transition-colors">
                    {imagePreview ? (
                      <div className="relative text-center">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="mx-auto h-48 object-contain rounded-md"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                          Klik lagi untuk mengganti
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-1 text-center">
                        <Camera className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <span className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                            <span>Upload a file</span>
                          </span>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          JPG, PNG up to 5MB
                        </p>
                      </div>
                    )}
                    <input
                      id="picture"
                      name="picture"
                      type="file"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                  </div>
                  {errors.picture && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.picture[0]}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Tombol Aksi */}
            <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate("/tools")}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-6 py-2 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#2196F3] hover:bg-blue-600 text-white font-medium px-6 py-2 rounded-lg disabled:bg-gray-400 flex items-center gap-2 transition-colors"
              >
                {loading ? "Menyimpan..." : "Simpan Alat"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ToolCreatePage;
