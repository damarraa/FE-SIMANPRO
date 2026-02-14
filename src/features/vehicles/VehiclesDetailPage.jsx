import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useUsersByRole from "../../hooks/useUsersByRole";
import useVehicleDetail from "./hooks/useVehicleDetail";
import useMaintenanceLogs from "./hooks/useMaintenanceLogs";
import useVehicleAssignments from "./hooks/useVehicleAssignments";
import MaintenanceLogsTable from "./components/MaintenanceLogsTable";
import VehicleAssignmentsHistory from "./components/VehicleAssignmentsHistory";
import {
  Truck,
  Image as ImageIcon,
  FileText,
  X,
  ZoomIn,
  ExternalLink,
} from "lucide-react";
import {
  DocumentTextIcon,
  MagnifyingGlassPlusIcon,
} from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import api, { ASSET_BASE_URL } from "../../api";
import { updateVehicle } from "./api";

const VehiclesDetailPage = () => {
  const navigate = useNavigate();
  const { id: vehicleId } = useParams();

  const { users: picUsers, isLoading: isLoadingUsers } =
    useUsersByRole("Logistic");

  const {
    vehicle,
    isLoading: isLoadingVehicle,
    refresh,
  } = useVehicleDetail(vehicleId);

  const {
    logs,
    isLoading: isLoadingLogs,
    refresh: refreshLogs,
  } = useMaintenanceLogs(vehicleId);

  const {
    assignments,
    isLoading: isLoadingAssignments,
    refresh: refreshAssignments,
  } = useVehicleAssignments(vehicleId);

  const [formData, setFormData] = useState({
    name: "",
    vehicle_type: "",
    merk: "",
    model: "",
    license_plate: "",
    purchase_year: "",
    capacity: "",
    vehicle_license: "",
    license_expiry_date: "",
    vehicle_identity_number: "",
    engine_number: "",
    tax_due_date: "",
    notes: "",
    document: null,
    pic_user_id: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [docPreview, setDocPreview] = useState(null);
  const [docName, setDocName] = useState(null);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [zoomedFile, setZoomedFile] = useState(null);

  useEffect(() => {
    if (vehicle) {
      setFormData({
        name: vehicle.name || "",
        vehicle_type: vehicle.vehicle_type || "",
        merk: vehicle.merk || "",
        model: vehicle.model || "",
        license_plate: vehicle.license_plate || "",
        purchase_year: vehicle.purchase_year || "",
        capacity: vehicle.capacity || "",
        vehicle_license: vehicle.vehicle_license || "",
        license_expiry_date: vehicle.license_expiry_date || "",
        vehicle_identity_number: vehicle.vehicle_identity_number || "",
        engine_number: vehicle.engine_number || "",
        tax_due_date: vehicle.tax_due_date || "",
        notes: vehicle.notes || "",
        pic_user_id: vehicle.pic?.id || "",
        document: null,
        picture: null,
      });

      if (vehicle.picture_path) {
        const timestamp = new Date().getTime();
        const url = vehicle.picture_path.startsWith("http")
          ? vehicle.picture_path
          : `${ASSET_BASE_URL}/storage/${vehicle.picture_path}?t=${timestamp}`;
        setImagePreview(url);
      } else {
        setImagePreview(null);
      }

      if (vehicle.docs_path) {
        setDocName("Dokumen Tersimpan");
        const timestamp = new Date().getTime();
        const url = vehicle.docs_path.startsWith("http")
          ? vehicle.docs_path
          : `${ASSET_BASE_URL}/storage/${vehicle.docs_path}?t=${timestamp}`;

        setDocPreview({
          url: url,
          type: url.toLowerCase().endsWith(".pdf")
            ? "application/pdf"
            : "image/jpeg",
        });
      } else {
        setDocName(null);
        setDocPreview(null);
      }
    }
  }, [vehicle]);

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:"))
        URL.revokeObjectURL(imagePreview);
      if (docPreview?.url && docPreview.url.startsWith("blob:"))
        URL.revokeObjectURL(docPreview.url);
    };
  }, [imagePreview, docPreview]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, [name]: file }));

      if (name === "picture") {
        setImagePreview(URL.createObjectURL(file));
      } else if (name === "document") {
        setDocName(file.name);
        setDocPreview({
          url: URL.createObjectURL(file),
          type: file.type,
        });
      }
    }
  };

  const handleZoom = (url, type) => {
    if (!url) return;
    setZoomedFile({ url, type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const dataToSubmit = new FormData();
    Object.keys(formData).forEach((key) => {
      const value = formData[key];

      if ((key === "picture" || key === "document") && value === null) return;
      if (key === "pic_user_id" && value === "") {
        dataToSubmit.append(key, "");
        return;
      }

      if (value !== null && value !== undefined) {
        dataToSubmit.append(key, value);
      }
    });

    try {
      await updateVehicle(vehicleId, dataToSubmit);

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data kendaraan berhasil diperbarui.",
        showConfirmButton: false,
        timer: 1500,
      });

      refresh();
    } catch (err) {
      console.error("Update Error: ", err);
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
          text:
            err.response?.data?.message ||
            "Gagal memperbarui data. Silakan coba lagi.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (isLoadingVehicle)
    return (
      <div className="p-8 text-center text-gray-500">
        Loading detail kendaraan...
      </div>
    );

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold text-[#0D47A1] mb-8 flex items-center gap-2">
        <Truck className="w-6 h-6" />
        Edit Kendaraan: {vehicle?.name}
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-5">
              <h3 className="font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">
                  1
                </span>
                Informasi Umum
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Kendaraan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Contoh: Truk Fuso"
                  className="block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipe <span className="text-red-500">*</span>
                </label>
                <select
                  name="vehicle_type"
                  value={formData.vehicle_type}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="" disabled>
                    Pilih Tipe Kendaraan
                  </option>
                  <option value="Mobil">Mobil</option>
                  <option value="Truk">Truk</option>
                  <option value="Alat Berat">Alat Berat</option>
                </select>
                {errors.vehicle_type && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.vehicle_type[0]}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Merk
                  </label>
                  <input
                    type="text"
                    name="merk"
                    value={formData.merk}
                    onChange={handleChange}
                    placeholder="Contoh: Mitsubishi"
                    className="block w-full px-3 py-2 border rounded-md shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Model
                  </label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    required
                    placeholder="Contoh: Canter FE 74"
                    className="block w-full px-3 py-2 border rounded-md shadow-sm"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <h3 className="font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">
                  2
                </span>
                Detail Teknis
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nomor Polisi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="license_plate"
                  value={formData.license_plate}
                  onChange={handleChange}
                  required
                  placeholder="Contoh: BM 1234 XY"
                  className="block w-full px-3 py-2 border rounded-md shadow-sm bg-gray-50"
                />
                {errors.license_plate && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.license_plate[0]}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tahun Beli
                  </label>
                  <input
                    type="number"
                    name="purchase_year"
                    value={formData.purchase_year}
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    onChange={handleChange}
                    placeholder="Contoh: 2020"
                    className="block w-full px-3 py-2 border rounded-md shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kapasitas
                  </label>
                  <input
                    type="text"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    placeholder="Contoh: 8 Ton / 4000cc"
                    className="block w-full px-3 py-2 border rounded-md shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  No. Rangka
                </label>
                <input
                  type="text"
                  name="vehicle_identity_number"
                  value={formData.vehicle_identity_number}
                  onChange={handleChange}
                  placeholder="Masukkan nomor rangka"
                  className="block w-full px-3 py-2 border rounded-md shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  No. Mesin
                </label>
                <input
                  type="text"
                  name="engine_number"
                  value={formData.engine_number}
                  onChange={handleChange}
                  placeholder="Masukkan nomor mesin"
                  className="block w-full px-3 py-2 border rounded-md shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-5">
              <h3 className="font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">
                  3
                </span>
                Legalitas & PIC
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  No. STNK
                </label>
                <input
                  type="text"
                  name="vehicle_license"
                  value={formData.vehicle_license}
                  onChange={handleChange}
                  placeholder="Masukkan nomor STNK"
                  className="block w-full px-3 py-2 border rounded-md shadow-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Exp STNK
                  </label>
                  <input
                    type="date"
                    name="license_expiry_date"
                    value={formData.license_expiry_date}
                    onChange={handleChange}
                    required
                    className="block w-full px-3 py-2 border rounded-md shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pajak Tahunan
                  </label>
                  <input
                    type="date"
                    name="tax_due_date"
                    value={formData.tax_due_date}
                    onChange={handleChange}
                    required
                    className="block w-full px-3 py-2 border rounded-md shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PIC Kendaraan
                </label>
                <select
                  name="pic_user_id"
                  value={formData.pic_user_id}
                  onChange={handleChange}
                  disabled={isLoadingUsers}
                  className="block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Pilih Penanggung Jawab</option>
                  {picUsers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catatan Tambahan
              </label>
              <textarea
                name="notes"
                rows="2"
                value={formData.notes || ""}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400"
                placeholder="Tambahkan catatan kondisi fisik, riwayat servis, atau info lainnya..."
              ></textarea>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
            {/* Foto Kendaraan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Foto Fisik Kendaraan
              </label>
              <div className="flex gap-4 items-start">
                <div
                  className="w-24 h-24 flex-shrink-0 border rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center relative group cursor-pointer hover:shadow-md"
                  onClick={() => handleZoom(imagePreview, "image/jpeg")}
                >
                  {imagePreview ? (
                    <>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 transition-opacity">
                        <ZoomIn className="w-6 h-6 text-white drop-shadow-md" />
                      </div>
                    </>
                  ) : (
                    <ImageIcon className="w-8 h-8 text-gray-300" />
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
                    Format: JPG/PNG. Maks 5MB.
                  </p>
                  {errors.picture && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.picture[0]}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Dokumen STNK/BPKB */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dokumen (STNK/BPKB)
              </label>

              <div
                className={`border-2 border-dashed border-gray-300 rounded-lg p-4 transition-colors bg-white ${docPreview ? "cursor-pointer hover:bg-gray-50" : ""}`}
                onClick={() =>
                  docPreview && handleZoom(docPreview.url, docPreview.type)
                }
              >
                <div className="flex items-center gap-3">
                  {docPreview?.type === "application/pdf" ? (
                    <div className="relative group">
                      <DocumentTextIcon className="w-8 h-8 text-red-500" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <MagnifyingGlassPlusIcon className="w-4 h-4 text-gray-600" />
                      </div>
                    </div>
                  ) : docPreview?.type?.startsWith("image/") ? (
                    <div className="relative w-10 h-10 rounded overflow-hidden group">
                      <img
                        src={docPreview.url}
                        alt="Doc"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 hidden group-hover:flex items-center justify-center">
                        <MagnifyingGlassPlusIcon className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  ) : (
                    <FileText className="w-8 h-8 text-gray-400" />
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-medium text-gray-900 truncate pr-2">
                        {docName || "Belum ada dokumen"}
                      </p>
                      {vehicle?.docs_path && !formData.document && (
                        <a
                          href={`${ASSET_BASE_URL}/storage/${vehicle.docs_path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                          onClick={(e) => e.stopPropagation()}
                          title="Buka di tab baru"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                    {docPreview && (
                      <p className="text-xs text-blue-600 mt-0.5">
                        Klik box untuk preview
                      </p>
                    )}

                    <div onClick={(e) => e.stopPropagation()}>
                      <input
                        type="file"
                        name="document"
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="block w-full text-sm text-gray-500 mt-2 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:bg-gray-100 file:text-gray-700"
                      />
                    </div>
                  </div>
                </div>
                {errors.document && (
                  <p className="text-red-500 text-xs mt-2">
                    {errors.document[0]}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate("/vehicles")}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-6 py-2 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#2196F3] hover:bg-blue-600 text-white font-medium px-6 py-2 rounded-lg disabled:bg-gray-400 flex items-center gap-2 transition-colors"
            >
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </div>
      </form>

      <MaintenanceLogsTable
        logs={logs}
        isLoading={isLoadingLogs}
        onDataUpdate={refreshLogs}
      />

      <VehicleAssignmentsHistory
        assignments={assignments}
        isLoading={isLoadingAssignments}
        onDataUpdate={refreshAssignments}
      />

      {zoomedFile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 transition-opacity duration-300"
          onClick={() => setZoomedFile(null)}
        >
          <div className="relative max-w-5xl w-full h-[90vh] flex items-center justify-center">
            <button
              onClick={() => setZoomedFile(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors z-50"
            >
              <X className="w-8 h-8" />
            </button>

            {zoomedFile.type?.startsWith("image/") ||
            zoomedFile.url?.match(/\.(jpeg|jpg|png|webp)$/i) ? (
              <img
                src={zoomedFile.url}
                alt="Zoomed"
                className="max-h-full max-w-full object-contain rounded-lg shadow-2xl border border-gray-700"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <iframe
                src={zoomedFile.url}
                title="Document Preview"
                className="w-full h-full rounded-lg shadow-2xl border border-gray-700 bg-white"
                onClick={(e) => e.stopPropagation()}
              />
            )}

            <p className="absolute -bottom-8 text-white/70 text-sm">
              Klik di luar area untuk menutup
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehiclesDetailPage;
