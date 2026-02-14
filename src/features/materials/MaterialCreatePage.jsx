import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Archive, Image as ImageIcon } from "lucide-react";
import useSuppliers from "../../hooks/useSuppliers";
import api from "../../api";
import Swal from "sweetalert2";

const MaterialCreatePage = () => {
  const navigate = useNavigate();
  const { suppliers, isLoading: isLoadingSuppliers } = useSuppliers();

  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    unit: "",
    supplier_id: "",
    is_dpt: false,
    description: "",
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
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, picture: file }));
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
      await api.post("/v1/materials", dataToSubmit, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Material baru berhasil ditambahkan.",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        navigate("/materials");
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
        Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: err.response?.data?.message || "Gagal menyimpan data.",
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
          <Archive className="w-6 h-6" />
          Tambah Material Baru
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* --- KOLOM KIRI (Info Dasar) --- */}
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="sku"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    SKU <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="sku"
                    name="sku"
                    onChange={handleChange}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Contoh: SEMEN-GRESIK-50KG"
                  />
                  {errors.sku && (
                    <p className="text-red-500 text-xs mt-1">{errors.sku[0]}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nama Material <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    onChange={handleChange}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Contoh: Semen Gresik 50kg"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.name[0]}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="unit"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Satuan <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="unit"
                      name="unit"
                      onChange={handleChange}
                      required
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                      placeholder="Pcs/Kg/Sak"
                    />
                    {errors.unit && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.unit[0]}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="supplier_id"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Supplier
                    </label>
                    <select
                      id="supplier_id"
                      name="supplier_id"
                      onChange={handleChange}
                      disabled={isLoadingSuppliers}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    >
                      <option value="">Pilih Supplier</option>
                      {suppliers.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                    {errors.supplier_id && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.supplier_id[0]}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* --- KOLOM KANAN (Detail & Foto) --- */}
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Deskripsi
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    onChange={handleChange}
                    rows="3"
                    className="block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
                </div>

                {/* Checkbox DPT */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                  <input
                    id="is_dpt"
                    name="is_dpt"
                    type="checkbox"
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="is_dpt"
                    className="text-sm font-medium text-gray-700 select-none cursor-pointer"
                  >
                    Item Standar (DPT)?
                  </label>
                </div>

                {/* Foto Upload Modern */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Foto Material
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md relative hover:bg-gray-50 transition-colors">
                    {imagePreview ? (
                      <div className="relative text-center">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="mx-auto h-40 object-contain rounded-md"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                          Klik untuk ganti foto
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-1 text-center">
                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600 justify-center">
                          <span className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                            <span>Upload a file</span>
                          </span>
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

            <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate("/materials")}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-6 py-2 rounded-lg"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#2196F3] hover:bg-blue-600 text-white font-medium px-6 py-2 rounded-lg disabled:bg-gray-400"
              >
                {loading ? "Menyimpan..." : "Simpan Material"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaterialCreatePage;
