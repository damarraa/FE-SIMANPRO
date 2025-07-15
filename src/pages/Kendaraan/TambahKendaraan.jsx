import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Truck, Construction, Upload, X } from "lucide-react";
import Header from "@/Components/Header/Header";

const FormTambahKendaraan = () => {
  const navigate = useNavigate();
  
  // Form state
  const [vehicleData, setVehicleData] = useState({
    jenis: "Kendaraan",
    merk: "",
    model: "",
    tipe: "",
    noPolisi: "",
    tahunPembelian: "",
    kapasitas: "",
    lokasi: "Gudang Utama",
    nomorRangka: "",
    nomorMesin: "",
    bahanBakar: "Bensin",
    kmTerakhir: "",
    pemilik: "Perusahaan",
    keterangan: "",
    gambar: null
  });

  const [previewImage, setPreviewImage] = useState(null);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicleData(prev => ({ ...prev, [name]: value }));
  };

  // Handle image upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVehicleData(prev => ({ ...prev, gambar: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Remove selected image
  const removeImage = () => {
    setVehicleData(prev => ({ ...prev, gambar: null }));
    setPreviewImage(null);
  };

  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Data kendaraan:", vehicleData);
    // Add your submission logic here
    navigate('/kendaraan');
  };

  return (
    <div className="p-6 max-w-[1800px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-[#0D47A1] flex items-center gap-2">
          {vehicleData.jenis === "Alat Berat" ? (
            <Construction className="w-6 h-6" />
          ) : (
            <Truck className="w-6 h-6" />
          )}
          Tambah {vehicleData.jenis} Baru
        </h2>
        <Header />
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          {/* Form Section Header */}
          <div className=" bg-[#2196F3] rounded-t-xl p-5">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">Informasi Dasar</h2>
          </div>
          
          {/* Form Fields */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <FormField 
                label="Jenis*"
                type="select"
                name="jenis"
                value={vehicleData.jenis}
                onChange={handleChange}
                options={[
                  { value: "Kendaraan", label: "Kendaraan" },
                  { value: "Alat Berat", label: "Alat Berat" }
                ]}
                required
              />

              <FormField 
                label="Merk*"
                type="text"
                name="merk"
                value={vehicleData.merk}
                onChange={handleChange}
                placeholder="Toyota"
                required
              />

              <FormField 
                label="Model*"
                type="text"
                name="model"
                value={vehicleData.model}
                onChange={handleChange}
                placeholder="Hiace"
                required
              />

              <FormField 
                label="Tipe*"
                type="text"
                name="tipe"
                value={vehicleData.tipe}
                onChange={handleChange}
                placeholder="Minibus"
                required
              />

              {vehicleData.jenis === "Kendaraan" && (
                <FormField 
                  label="Nomor Polisi*"
                  type="text"
                  name="noPolisi"
                  value={vehicleData.noPolisi}
                  onChange={handleChange}
                  placeholder="B 1234 ABC"
                  required={vehicleData.jenis === "Kendaraan"}
                />
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <FormField 
                label="Tahun Pembelian*"
                type="number"
                name="tahunPembelian"
                value={vehicleData.tahunPembelian}
                onChange={handleChange}
                placeholder="2020"
                required
              />

              <FormField 
                label="Kapasitas*"
                type="text"
                name="kapasitas"
                value={vehicleData.kapasitas}
                onChange={handleChange}
                placeholder="8 Orang / 3 Ton"
                required
              />

              <FormField 
                label="Lokasi*"
                type="select"
                name="lokasi"
                value={vehicleData.lokasi}
                onChange={handleChange}
                options={[
                  { value: "Gudang Utama", label: "Gudang Utama" },
                  { value: "Proyek A", label: "Proyek A" },
                  { value: "Proyek B", label: "Proyek B" },
                  { value: "Kantor Pusat", label: "Kantor Pusat" }
                ]}
                required
              />

              <FormField 
                label="Bahan Bakar*"
                type="select"
                name="bahanBakar"
                value={vehicleData.bahanBakar}
                onChange={handleChange}
                options={[
                  { value: "Bensin", label: "Bensin" },
                  { value: "Solar", label: "Solar" },
                  { value: "Listrik", label: "Listrik" },
                  { value: "Lainnya", label: "Lainnya" }
                ]}
                required
              />

              <FormField 
                label="KM Terakhir"
                type="number"
                name="kmTerakhir"
                value={vehicleData.kmTerakhir}
                onChange={handleChange}
                placeholder="45780"
              />
            </div>

            {/* Image Upload */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#0D47A1] mb-2">Foto Kendaraan</label>
              <ImageUpload 
                previewImage={previewImage}
                handleFileChange={handleFileChange}
                removeImage={removeImage}
              />
            </div>

            {/* Additional Info */}
            <div className="md:col-span-2 space-y-4">
              <FormField 
                label="Nomor Rangka"
                type="text"
                name="nomorRangka"
                value={vehicleData.nomorRangka}
                onChange={handleChange}
                placeholder="MHTCV81J6K1234567"
              />

              <FormField 
                label="Nomor Mesin"
                type="text"
                name="nomorMesin"
                value={vehicleData.nomorMesin}
                onChange={handleChange}
                placeholder="2KD-FTV1234567"
              />

              <FormField 
                label="Pemilik"
                type="select"
                name="pemilik"
                value={vehicleData.pemilik}
                onChange={handleChange}
                options={[
                  { value: "Perusahaan", label: "Milik Perusahaan" },
                  { value: "Sewa", label: "Sewa" }
                ]}
              />

              <div>
                <label className="block text-sm font-medium text-[#0D47A1] mb-1">Keterangan</label>
                <textarea
                  className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition h-24"
                  placeholder="Catatan tambahan tentang kendaraan..."
                  name="keterangan"
                  value={vehicleData.keterangan}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/kendaraan')}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-[#2196F3] text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Simpan Kendaraan
          </button>
        </div>
      </form>
    </div>
  );
};

// Reusable Form Field Component
const FormField = ({ label, type, name, value, onChange, placeholder, options, required }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-[#0D47A1] mb-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {type === "select" ? (
        <select
          className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
          name={name}
          value={value}
          onChange={onChange}
          required={required}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
        />
      )}
    </div>
  );
};

// Image Upload Component
const ImageUpload = ({ previewImage, handleFileChange, removeImage }) => {
  return (
    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
      <div className="space-y-1 text-center">
        {previewImage ? (
          <div className="relative">
            <img 
              src={previewImage} 
              alt="Preview" 
              className="mx-auto h-48 object-contain"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
            </div>
            <div className="flex text-sm text-gray-600 justify-center">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer bg-white rounded-md font-medium text-[#2196F3] hover:text-blue-500 focus-within:outline-none"
              >
                <span>Upload file</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </label>
              <p className="pl-1">atau drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 5MB</p>
          </>
        )}
      </div>
    </div>
  );
};

export default FormTambahKendaraan;