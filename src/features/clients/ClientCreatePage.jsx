import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import Swal from "sweetalert2";

const ClientCreatePage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    client_name: "",
    client_contact_person: "",
    client_phone: "",
    email: "",
    website_link: "",
    address: "",
    industry: "",
    client_type: "Perusahaan",
    logo: null,
  });

  const [logoPreview, setLogoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
    };
  }, [logoPreview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, logo: file }));
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const dataToSubmit = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key !== "logo" && formData[key] !== null) {
        dataToSubmit.append(key, formData[key]);
      }
    });

    if (formData.logo) {
      dataToSubmit.append("logo", formData.logo);
    }

    try {
      await api.post("/v1/clients", dataToSubmit, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Klien baru berhasil ditambahkan.",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        navigate("/clients");
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
          title: "Mohon periksa inputan Anda.",
        });
      } else {
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
          Tambah Klien Baru
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            {errors.general && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
                {errors.general}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nama Klien */}
              <div className="">
                <label
                  htmlFor="client_name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nama Perusahaan
                </label>
                <input
                  type="text"
                  id="client_name"
                  name="client_name"
                  value={formData.client_name}
                  onChange={handleChange}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nama Perusahaan"
                />
                {errors.client_name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.client_name[0]}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Logo Perusahaan
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 border rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center relative">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 text-xs text-center px-1">
                        No Logo
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Format: JPG, PNG, WebP. Max: 2MB.
                    </p>
                    {errors.logo && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.logo[0]}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Nama Klien */}
              <div className="">
                <label
                  htmlFor="client_contact_person"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  PIC / Contact Person
                </label>
                <textarea
                  id="client_contact_person"
                  name="client_contact_person"
                  value={formData.client_contact_person}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Nama Penanggung Jawab"
                  className="block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
                {errors.client_contact_person && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.client_contact_person[0]}
                  </p>
                )}
              </div>

              {/* Telepon */}
              <div className="">
                <label
                  htmlFor="client_phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nomor Telepon
                </label>
                <input
                  type="tel"
                  id="client_phone"
                  name="client_phone"
                  value={formData.client_phone}
                  onChange={handleChange}
                  placeholder="+62 ..."
                  className="block w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.client_phone && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.client_phone[0]}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@email.com"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>
                )}
              </div>

              {/* Website */}
              <div>
                <label
                  htmlFor="website_link"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Website
                </label>
                <input
                  type="url"
                  id="website_link"
                  name="website_link"
                  placeholder="https://"
                  value={formData.website_link}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.website_link && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.website_link[0]}
                  </p>
                )}
              </div>

              {/* Jenis Klien */}
              <div>
                <label
                  htmlFor="client_type"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Jenis Klien <span className="text-red-500">*</span>
                </label>
                <select
                  id="client_type"
                  name="client_type"
                  value={formData.client_type}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Perusahaan">Perusahaan</option>
                  <option value="Individu">Individu</option>
                  <option value="Distributor">Distributor</option>
                  <option value="Mitra">Mitra</option>
                </select>
                {errors.client_type && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.client_type[0]}
                  </p>
                )}
              </div>

              {/* Industri */}
              <div>
                <label
                  htmlFor="industry"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Industri
                </label>
                <input
                  type="text"
                  id="industry"
                  name="industry"
                  placeholder="Contoh: Konstruksi, IT, Retail"
                  value={formData.industry}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.industry && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.industry[0]}
                  </p>
                )}
              </div>

              {/* Alamat */}
              <div className="md:col-span-2">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Alamat Lengkap
                </label>
                <textarea
                  id="address"
                  name="address"
                  rows="3"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Jl. ..."
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.address[0]}
                  </p>
                )}
              </div>
            </div>

            {/* Tombol Aksi */}
            <div className="flex justify-end gap-4 mt-6 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate("/clients")}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-6 py-2 rounded-lg"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#2196F3] hover:bg-blue-600 text-white font-medium px-6 py-2 rounded-lg disabled:bg-gray-400"
              >
                {loading ? "Menyimpan..." : "Simpan Klien"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientCreatePage;
