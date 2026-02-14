import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useSuppliers from "../../hooks/useSuppliers";
import useMaterialDetail from "./hooks/useMaterialDetail";
import { Archive, Image as ImageIcon } from "lucide-react";
import { getImageUrl } from "../../utils/image";
import Swal from "sweetalert2";
import api from "../../api";

const MaterialDetailPage = () => {
  const navigate = useNavigate();
  const { material, isLoading, update, refresh } = useMaterialDetail();
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
    if (material) {
      setFormData({
        sku: material.sku || "",
        name: material.name || "",
        unit: material.unit || "",
        supplier_id: material.supplier?.id || "",
        is_dpt: material.is_dpt || false,
        description: material.description || "",
        picture: null,
      });

      let initialPath = material.picture_path;

      if (Array.isArray(initialPath) && initialPath.length > 0) {
        initialPath = initialPath[0];
      }

      if (typeof initialPath === "string") {
        setImagePreview(getImageUrl(initialPath));
      } else {
        setImagePreview(null);
      }
    }
  }, [material]);

  const handleImageClick = () => {
    if (!imagePreview) return;

    Swal.fire({
      imageUrl: imagePreview,
      imageAlt: formData.name,
      title: formData.name,
      showConfirmButton: false,
      showCloseButton: true,
      width: "auto",
      padding: "1rem",
      backdrop: `rgba(0,0,0,0.8)`,
    });
  };

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
    dataToSubmit.append("_method", "PUT");

    Object.keys(formData).forEach((key) => {
      if (key === "picture" && formData[key] === null) return;
      if (formData[key] !== null) {
        dataToSubmit.append(key, formData[key]);
      }
    });

    try {
      await api.post(`/v1/materials/${material.id}`, dataToSubmit, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // await update(dataToSubmit);
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data material berhasil diperbarui.",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        navigate("/materials");
      });

      refresh();
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
        // setErrors({ general: "Gagal memperbarui data. Silakan coba lagi." });
        Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: "Gagal memperbarui data. Silakan coba lagi.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading detail material...
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-[#0D47A1] mb-8 flex items-center gap-2">
        <Archive className="w-6 h-6" />
        Edit Material: {material?.name}
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="sku"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  SKU
                </label>
                <input
                  type="text"
                  id="sku"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Mengubah SKU akan mengubah nama file gambar secara otomatis.
                </p>
                {errors.sku && (
                  <p className="text-red-500 text-xs mt-1">{errors.sku[0]}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nama Material
                </label>
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Satuan
                  </label>
                  <input
                    id="unit"
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Supplier
                  </label>
                  <select
                    id="supplier_id"
                    name="supplier_id"
                    value={formData.supplier_id}
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
                </div>
              </div>
            </div>

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
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md shadow-sm"
                ></textarea>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                <input
                  id="is_dpt"
                  name="is_dpt"
                  type="checkbox"
                  checked={formData.is_dpt === 1}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="is_dpt"
                  className="text-sm font-medium text-gray-700"
                >
                  Item Standar (DPT)?
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Foto Material
                </label>
                <div className="flex gap-4 items-start">
                  <div className="w-32 h-32 flex-shrink-0 border rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center relative group">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        onClick={handleImageClick}
                        className="w-full h-full object-cover cursor-pointer hover:scale-110 transition-transform duration-200"
                        title="Klik untuk memperbesar"
                      />
                    ) : (
                      <ImageIcon className="w-10 h-10 text-gray-300" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      name="picture"
                      onChange={handleFileChange}
                      accept="image/*"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Format: JPG/PNG. Maks 5MB. Kosongkan jika tidak ingin
                      mengubah foto.
                    </p>
                    {errors.picture && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.picture[0]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6 pt-6 border-t">
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
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MaterialDetailPage;
