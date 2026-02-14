import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import useClients from "./hooks/useClients";
import useClientDetail from "./hooks/useClientDetail";
import { getImageUrl } from "../../utils/image";
import Swal from "sweetalert2";

const ClientDetailPage = () => {
  const navigate = useNavigate();
  const { client, isLoading, update } = useClientDetail();

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
    if (client) {
      setFormData({
        client_name: client.client_name || "",
        client_contact_person: client.client_contact_person || "",
        client_phone: client.client_phone || "",
        email: client.email || "",
        website_link: client.website_link || "",
        address: client.address || "",
        industry: client.industry || "",
        client_type: client.client_type || "perusahaan",
        logo: null,
      });

      if (client.logo_url) {
        setLogoPreview(client.logo_url);
      }
    }
  }, [client]);

  useEffect(() => {
    return () => {
      if (logoPreview && logoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
    dataToSubmit.append("_method", "PUT");

    Object.keys(formData).forEach((key) => {
      if (key !== "logo" && formData[key] !== null) {
        dataToSubmit.append(key, formData[key]);
      }
    });

    if (formData.logo instanceof File) {
      dataToSubmit.append("logo", formData.logo);
    }

    try {
      await update(dataToSubmit);

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data klien berhasil diperbarui.",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        navigate("/clients");
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

  const user = useAuthStore((state) => state.user);
  const firstRole = user?.roles?.[0];
  const userRole =
    (typeof firstRole === "object" ? firstRole.name : firstRole) || "Guest";

  const hasFullAccess = ["Admin", "Super Admin"].includes(userRole);

  if (isLoading)
    return <div className="p-8 text-center">Loading data klien...</div>;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-[#0D47A1] mb-8 flex items-center gap-2">
        Edit Klien: {client?.client_name}
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
              />
              {errors.client_name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.client_name[0]}
                </p>
              )}
            </div>

            {/* Logo Section */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Logo Perusahaan
              </label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 border rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center relative shrink-0">
                  {logoPreview ? (
                    <img
                      src={getImageUrl(logoPreview)}
                      // src={logoPreview}
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
                    Biarkan kosong jika tidak ingin mengubah logo.
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
            <div className="md:col-span-2">
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
                placeholder="Nama Penanggung Jawab"
                rows="3"
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
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                value={formData.website_link}
                onChange={handleChange}
                placeholder="https://"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="perusahaan">Perusahaan</option>
                <option value="individu">Individu</option>
                <option value="distributor">Distributor</option>
                <option value="mitra">Mitra</option>
              </select>
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
                value={formData.industry}
                onChange={handleChange}
                placeholder="Contoh: Konstruksi, IT, Retail"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
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
                value={formData.address}
                onChange={handleChange}
                rows="3"
                placeholder="Jl. ..."
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 mt-6 border-t">
            <button
              type="button"
              onClick={() => navigate("/clients")}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-6 py-2 rounded-lg"
            >
              Kembali
            </button>

            {hasFullAccess && (
              <button
                type="submit"
                disabled={loading}
                className="bg-[#2196F3] hover:bg-blue-600 text-white font-medium px-6 py-2 rounded-lg disabled:bg-gray-400"
              >
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default ClientDetailPage;
