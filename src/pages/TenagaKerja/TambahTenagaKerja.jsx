import React, { useState } from "react";
import { Upload, User, Calendar, MapPin, Phone, Mail, Briefcase, Save } from "lucide-react";

const TambahPegawai = () => {
  const [formData, setFormData] = useState({
    nik: "",
    nama: "",
    tanggalLahir: "",
    tempatLahir: "",
    jenisKelamin: "",
    email: "",
    telepon: "",
    alamat: "",
    jabatan: "",
    departemen: "",
    status: "",
    tanggalMasuk: ""
  });
  
  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({...prev, photo: "Ukuran file maksimal 2MB"}));
        return;
      }
      
      // Validate image dimensions would require actual image loading
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setErrors(prev => ({...prev, photo: null}));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({...prev, [name]: null}));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nik) newErrors.nik = "NIK wajib diisi";
    else if (!/^\d{16}$/.test(formData.nik)) newErrors.nik = "NIK harus 16 digit angka";
    
    if (!formData.nama) newErrors.nama = "Nama wajib diisi";
    if (!formData.tanggalLahir) newErrors.tanggalLahir = "Tanggal lahir wajib diisi";
    if (!formData.tempatLahir) newErrors.tempatLahir = "Tempat lahir wajib diisi";
    if (!formData.jenisKelamin) newErrors.jenisKelamin = "Jenis kelamin wajib dipilih";
    
    if (!formData.email) newErrors.email = "Email wajib diisi";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Email tidak valid";
    
    if (!formData.telepon) newErrors.telepon = "Nomor telepon wajib diisi";
    else if (!/^\+?\d{10,15}$/.test(formData.telepon)) newErrors.telepon = "Nomor telepon tidak valid";
    
    if (!formData.alamat) newErrors.alamat = "Alamat wajib diisi";
    if (!formData.jabatan) newErrors.jabatan = "Jabatan wajib dipilih";
    if (!formData.departemen) newErrors.departemen = "Departemen wajib dipilih";
    if (!formData.status) newErrors.status = "Status wajib dipilih";
    if (!formData.tanggalMasuk) newErrors.tanggalMasuk = "Tanggal masuk wajib diisi";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        console.log("Form submitted:", { ...formData, photo: photoPreview });
        setIsSubmitting(false);
        alert("Pegawai berhasil ditambahkan!");
        // Reset form
        setFormData({
          nik: "",
          nama: "",
          tanggalLahir: "",
          tempatLahir: "",
          jenisKelamin: "",
          email: "",
          telepon: "",
          alamat: "",
          jabatan: "",
          departemen: "",
          status: "",
          tanggalMasuk: ""
        });
        setPhotoPreview(null);
      }, 1500);
    }
  };

  return (
    <div className="p-6 max-w-[1800px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 flex-wrap">
        <h2 className="text-2xl font-bold text-[#0D47A1] flex items-center gap-2">
          Tambah Pegawai Baru
        </h2>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Informasi Pribadi */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 border border-gray-200">
          <div className="bg-[#2196F3] text-white px-4 py-3 flex items-center gap-2">
            <User className="w-4 h-4" />
            <h2 className="font-medium">Informasi Pribadi</h2>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Upload Photo */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Foto Pegawai</label>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gray-200 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Upload className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Format: JPG, PNG (max 2MB)</p>
                  <p className="text-xs text-gray-500">Rasio 1:1, ukuran minimal 200x200px</p>
                  {errors.photo && <p className="text-xs text-red-500 mt-1">{errors.photo}</p>}
                </div>
              </div>
            </div>

            {/* NIK & Nama */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">NIK</label>
              <input
                type="text"
                name="nik"
                value={formData.nik}
                onChange={handleChange}
                placeholder="327xxx"
                className={`w-full px-3 py-2 border ${errors.nik ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm`}
              />
              {errors.nik && <p className="text-xs text-red-500 mt-1">{errors.nik}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                placeholder="Nama lengkap"
                className={`w-full px-3 py-2 border ${errors.nama ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm`}
              />
              {errors.nama && <p className="text-xs text-red-500 mt-1">{errors.nama}</p>}
            </div>

            {/* TTL & Jenis Kelamin */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Tanggal Lahir
                </label>
                <input
                  type="date"
                  name="tanggalLahir"
                  value={formData.tanggalLahir}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.tanggalLahir ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm`}
                />
                {errors.tanggalLahir && <p className="text-xs text-red-500 mt-1">{errors.tanggalLahir}</p>}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tempat Lahir
                </label>
                <input
                  type="text"
                  name="tempatLahir"
                  value={formData.tempatLahir}
                  onChange={handleChange}
                  placeholder="Kota"
                  className={`w-full px-3 py-2 border ${errors.tempatLahir ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm`}
                />
                {errors.tempatLahir && <p className="text-xs text-red-500 mt-1">{errors.tempatLahir}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
              <select
                name="jenisKelamin"
                value={formData.jenisKelamin}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.jenisKelamin ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm`}
              >
                <option value="">Pilih Jenis Kelamin</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
              {errors.jenisKelamin && <p className="text-xs text-red-500 mt-1">{errors.jenisKelamin}</p>}
            </div>

            {/* Email & No Telp */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Mail className="w-4 h-4" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@example.com"
                className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm`}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Phone className="w-4 h-4" />
                No Telepon
              </label>
              <input
                type="tel"
                name="telepon"
                value={formData.telepon}
                onChange={handleChange}
                placeholder="+628xxxxx"
                className={`w-full px-3 py-2 border ${errors.telepon ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm`}
              />
              {errors.telepon && <p className="text-xs text-red-500 mt-1">{errors.telepon}</p>}
            </div>

            {/* Alamat */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                Alamat
              </label>
              <textarea
                rows={3}
                name="alamat"
                value={formData.alamat}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.alamat ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm`}
                placeholder="Tulis alamat lengkap..."
              ></textarea>
              {errors.alamat && <p className="text-xs text-red-500 mt-1">{errors.alamat}</p>}
            </div>
          </div>
        </div>

        {/* Informasi Pekerjaan */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 border border-gray-200">
          <div className="bg-[#2196F3] text-white px-4 py-3 flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            <h2 className="font-medium">Informasi Pekerjaan</h2>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jabatan/Posisi</label>
              <select
                name="jabatan"
                value={formData.jabatan}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.jabatan ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm`}
              >
                <option value="">Pilih Jabatan</option>
                <option value="Manager">Manager</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Staff">Staff</option>
                <option value="Direktur">Direktur</option>
              </select>
              {errors.jabatan && <p className="text-xs text-red-500 mt-1">{errors.jabatan}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Departemen/Divisi</label>
              <select
                name="departemen"
                value={formData.departemen}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.departemen ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm`}
              >
                <option value="">Pilih Departemen</option>
                <option value="HRD">HRD</option>
                <option value="Keuangan">Keuangan</option>
                <option value="Produksi">Produksi</option>
                <option value="Pemasaran">Pemasaran</option>
                <option value="IT">IT</option>
              </select>
              {errors.departemen && <p className="text-xs text-red-500 mt-1">{errors.departemen}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status Kepegawaian</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.status ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm`}
              >
                <option value="">Pilih Status</option>
                <option value="Tetap">Tetap</option>
                <option value="Kontrak">Kontrak</option>
                <option value="Magang">Magang</option>
                <option value="Paruh Waktu">Paruh Waktu</option>
              </select>
              {errors.status && <p className="text-xs text-red-500 mt-1">{errors.status}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Tanggal Masuk Kerja
              </label>
              <input
                type="date"
                name="tanggalMasuk"
                value={formData.tanggalMasuk}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.tanggalMasuk ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm`}
              />
              {errors.tanggalMasuk && <p className="text-xs text-red-500 mt-1">{errors.tanggalMasuk}</p>}
            </div>
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="flex justify-end gap-4">
          <button 
            type="button"
            className="px-6 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <Save className="w-4 h-4" />
            Simpan Draft
          </button>
          <button 
            type="submit"
            className="px-6 py-2 rounded-md bg-[#2196F3] text-white hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium disabled:bg-blue-400"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Memproses...
              </>
            ) : (
              <>
                <User className="w-4 h-4" />
                Tambah Pegawai
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TambahPegawai;