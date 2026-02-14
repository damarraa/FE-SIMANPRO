import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { WrenchScrewdriverIcon, PhotoIcon } from "@heroicons/react/24/outline";
import useToolDetail from "./hooks/useToolDetail";
import useAssetLocations from "./hooks/useAssetLocations";
import useAssetAssignments from "./hooks/useAssetAssignments";
import AssetAssignmentsHistory from "./components/AssetAssignmentsHistory";
import AssetLocationsTable from "./components/AssetLocationsTable";
import { getImageUrl, DEFAULT_TOOL_IMAGE } from "../../utils/image";
import Swal from "sweetalert2";
import api from "../../api";

const ToolDetailPage = () => {
  const navigate = useNavigate();
  const { id: toolId } = useParams();
  const { tool, isLoading, refresh } = useToolDetail();

  const {
    locations,
    isLoading: isLoadingLocations,
    refresh: refreshLocations,
  } = useAssetLocations(toolId);

  const {
    assignments,
    isLoading: isLoadingAssignments,
    refresh: refreshAssignments,
  } = useAssetAssignments(toolId);

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
    if (tool) {
      setFormData({
        name: tool.name || "",
        tool_code: tool.tool_code || "",
        brand: tool.brand || "",
        serial_number: tool.serial_number || "",
        purchase_date: tool.purchase_date || "",
        unit_price: tool.unit_price || "",
        condition: tool.condition || "Baik",
        warranty_period: tool.warranty_period || "",
        picture: null,
      });

      let initialImage = null;

      if (Array.isArray(tool.picture_path) && tool.picture_path.length > 0) {
        initialImage = tool.picture_path[0];
      } else if (typeof tool.picture_path === "string") {
        initialImage = tool.picture_path;
      }

      // setImagePreview(initialImage ? getImageUrl(initialImage) : null);
      setImagePreview(getImageUrl(initialImage, DEFAULT_TOOL_IMAGE));
    }
  }, [tool]);

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
    dataToSubmit.append("_method", "PUT");

    Object.keys(formData).forEach((key) => {
      if (key === "picture" && formData[key] === null) {
        return;
      }
      if (formData[key] !== null) {
        dataToSubmit.append(key, formData[key]);
      }
    });

    try {
      await api.post(`/v1/tools/${toolId}`, dataToSubmit, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data alat berhasil diperbarui.",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        navigate("/tools");
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
          text:
            err.response?.data?.message ||
            "Gagal memperbarui data. Silakan coba lagi.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (isLoading)
    return <div className="p-8 text-center text-gray-500">Loading data...</div>;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-[#0D47A1] mb-8 flex items-center gap-2">
        <WrenchScrewdriverIcon className="w-6 h-6" />
        Edit Alat: {tool?.name}
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nama Alat
                </label>
                <input
                  type="text"
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
              <div>
                <label
                  htmlFor="tool_code"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Kode Alat
                </label>
                <input
                  type="text"
                  id="tool_code"
                  name="tool_code"
                  value={formData.tool_code}
                  onChange={handleChange}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Mengubah kode akan mengubah nama file foto secara otomatis.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Merek
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Serial Number
                  </label>
                  <input
                    type="text"
                    name="serial_number"
                    value={formData.serial_number}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tgl Pembelian
                  </label>
                  <input
                    type="date"
                    name="purchase_date"
                    value={formData.purchase_date}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Harga Beli
                  </label>
                  <input
                    type="number"
                    name="unit_price"
                    value={formData.unit_price}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kondisi
                  </label>
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  >
                    <option value="Baik">Baik</option>
                    <option value="Perlu Perbaikan">Perlu Perbaikan</option>
                    <option value="Rusak">Rusak</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Masa Garansi
                  </label>
                  <input
                    type="date"
                    name="warranty_period"
                    value={formData.warranty_period}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  />
                </div>
              </div>

              {/* Foto Preview & Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Foto Alat
                </label>
                <div className="flex gap-4 items-start">
                  <div className="w-32 h-32 flex-shrink-0 border rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                    {imagePreview ? (
                      <img
                        src={imagePreview || DEFAULT_TOOL_IMAGE}
                        alt="Tool Preview"
                        onClick={handleImageClick}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = DEFAULT_TOOL_IMAGE;
                        }}
                        className="w-full h-full object-contain"
                        title="Klik untuk memperbesar"
                      />
                    ) : (
                      <PhotoIcon className="w-10 h-10 text-gray-300" />
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
                      Format: JPG/PNG. Maks 5MB. Biarkan kosong jika tidak ingin
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

          <div className="flex justify-end gap-4 pt-6 mt-6 border-t">
            <button
              type="button"
              onClick={() => navigate("/tools")}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-6 py-2 rounded-lg"
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

      <AssetLocationsTable
        locations={locations}
        isLoading={isLoadingLocations}
        onDataUpdate={refreshLocations}
      />

      <AssetAssignmentsHistory
        assignments={assignments}
        isLoading={isLoadingAssignments}
        onDataUpdate={refreshAssignments}
      />
    </div>
  );
};

export default ToolDetailPage;
