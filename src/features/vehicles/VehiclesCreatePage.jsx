import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Truck, Image as ImageIcon, FileText } from "lucide-react";
import useUsersByRole from "../../hooks/useUsersByRole";
import api from "../../api";
import Swal from "sweetalert2";

const VehiclesCreatePage = () => {
  const navigate = useNavigate();
  const { users: picUsers, isLoading: isLoadingUsers } =
    useUsersByRole("Logistic");

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
    picture: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [docName, setDocName] = useState(null);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, [name]: file }));

      if (name === "picture") {
        setImagePreview(URL.createObjectURL(file));
      } else if (name === "document") {
        setDocName(file.name);
      }
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
      await api.post("/v1/vehicles", dataToSubmit, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Kendaraan baru berhasil ditambahkan.",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        navigate("/vehicles");
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
        // setErrors({ general: "Gagal menyimpan data." });
        Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: err.response?.data?.message || "Gagal meyimpan data kendaraan.",
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
          <Truck className="w-6 h-6" />
          Tambah Kendaraan Baru
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 border-b pb-2">
                  Informasi Umum
                </h3>

                <div className="">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nama Kendaraan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    onChange={handleChange}
                    required
                    placeholder="Contoh: Truk Fuso"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.name[0]}
                    </p>
                  )}
                </div>

                <div className="">
                  <label
                    htmlFor="vehicle_type"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tipe <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="vehicle_type"
                    name="vehicle_type"
                    value={formData.vehicle_type}
                    onChange={handleChange}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
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
                  <div className="">
                    <label
                      htmlFor="merk"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Merk
                    </label>
                    <input
                      type="text"
                      id="merk"
                      name="merk"
                      onChange={handleChange}
                      placeholder="Contoh: Mitsubishi"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.merk && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.merk[0]}
                      </p>
                    )}
                  </div>

                  <div className="">
                    <label
                      htmlFor="model"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Model
                    </label>
                    <input
                      type="text"
                      id="model"
                      name="model"
                      onChange={handleChange}
                      required
                      placeholder="Contoh: Canter FE 74"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.model && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.model[0]}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 border-b pb-2">
                  Detail Teknis
                </h3>

                <div className="">
                  <label
                    htmlFor="license_plate"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nomor Polisi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="license_plate"
                    name="license_plate"
                    onChange={handleChange}
                    placeholder="Contoh: BM 1234 XY"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.license_plate && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.license_plate[0]}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="">
                    <label
                      htmlFor="purchase_year"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Tahun Pembelian
                    </label>
                    <input
                      id="purchase_year"
                      name="purchase_year"
                      type="number"
                      min="1980"
                      max={new Date().getFullYear}
                      step="1"
                      placeholder="Contoh: 2020"
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.purchase_year && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.purchase_year[0]}
                      </p>
                    )}
                  </div>

                  <div className="">
                    <label
                      htmlFor="capacity"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Kapasitas
                    </label>
                    <input
                      id="capacity"
                      name="capacity"
                      type="text"
                      onChange={handleChange}
                      placeholder="Contoh: 8 Ton / 4000cc"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="">
                  <label
                    htmlFor="vehicle_identity_number"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    No. Rangka
                  </label>
                  <input
                    type="text"
                    id="vehicle_identity_number"
                    name="vehicle_identity_number"
                    onChange={handleChange}
                    placeholder="Masukkan nomor rangka"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.vehicle_identity_number && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.vehicle_identity_number[0]}
                    </p>
                  )}
                </div>

                <div className="">
                  <label
                    htmlFor="engine_number"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    No. Mesin
                  </label>
                  <input
                    type="text"
                    id="engine_number"
                    name="engine_number"
                    onChange={handleChange}
                    placeholder="Masukkan nomor mesin"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.engine_number && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.engine_number[0]}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 border-b pb-2">
                  Legalitas & Foto
                </h3>

                <div className="">
                  <label
                    htmlFor="vehicle_license"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    No. STNK
                  </label>
                  <input
                    type="text"
                    id="vehicle_license"
                    name="vehicle_license"
                    onChange={handleChange}
                    placeholder="Masukkan nomor STNK"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.vehicle_license && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.vehicle_license[0]}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="">
                    <label
                      htmlFor="license_expiry_date"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Exp STNK
                    </label>
                    <input
                      id="license_expiry_date"
                      name="license_expiry_date"
                      type="date"
                      onChange={handleChange}
                      required
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="">
                    <label
                      htmlFor="tax_due_date"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Jatuh Tempo Pajak
                    </label>
                    <input
                      id="tax_due_date"
                      name="tax_due_date"
                      type="date"
                      onChange={handleChange}
                      required
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="">
                  <label
                    htmlFor="pic_user_id"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    PIC Kendaraan
                  </label>
                  <select
                    id="pic_user_id"
                    name="pic_user_id"
                    onChange={handleChange}
                    disabled={isLoadingUsers}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
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
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Catatan
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows="3"
                  value={formData.notes || ""}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                  placeholder="Tambahkan catatan kondisi fisik, riwayat servis, atau info lainnya..."
                ></textarea>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
              <div className="">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Foto Fisik Kendaraan
                </label>
                <div className="flex gap-4 items-start">
                  <div className="w-24 h-24 flex-shrink-0 border rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
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
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Format: JPG/PNG. Max 5MB.
                    </p>
                    {errors.picture && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.picture[0]}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="">
                <label
                  htmlFor="document"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Dokumen (STNK/BPKB)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-gray-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {docName || "Belum ada file dipilih"}
                      </p>
                      <input
                        type="file"
                        name="document"
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="block w-full text-sm text-gray-500 mt-1 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:bg-gray-100 file:text-gray-700"
                      />
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

            <div className="flex justify-end gap-4 mt-6 pt-6">
              <button
                type="button"
                onClick={() => navigate("/vehicles")}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-6 py-2 rounded-lg"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#2196F3] hover:bg-blue-600 text-white font-medium px-6 py-2 rounded-lg disabled:bg-gray-400"
              >
                {loading ? "Menyimpan..." : "Simpan Kendaraan"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehiclesCreatePage;
