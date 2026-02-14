import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SignatureCanvas from "react-signature-canvas";
import {
  User,
  Save,
  Eraser,
  Upload,
  Key,
  Mail,
  FileSignature,
  Eye,
  EyeOff,
} from "lucide-react";
import api from "../../api";
import useProfile from "./hooks/useProfile";
import { getImageUrl } from "../../utils/image";
import Swal from "sweetalert2";

const EditProfilePage = () => {
  const navigate = useNavigate();
  const { user, isLoading, errors, update } = useProfile();
  const sigPad = useRef({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    profile_picture: null,
    signature: null,
  });

  const [previews, setPreviews] = useState({
    avatar: null,
    currentSignature: null,
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        password: "",
        password_confirmation: "",
      }));

      setPreviews({
        avatar: getImageUrl(user.profile_picture),
        currentSignature: getImageUrl(user.signature),
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profile_picture: file }));
      setPreviews((prev) => ({ ...prev, avatar: URL.createObjectURL(file) }));
    }
  };

  const clearSignature = () => {
    sigPad.current.clear();
    setFormData((prev) => ({ ...prev, signature: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    let signatureData = null;
    if (sigPad.current && !sigPad.current.isEmpty()) {
      signatureData = sigPad.current.getCanvas().toDataURL("image/png");
    }

    const payload = {
      ...formData,
      signature: signatureData,
    };

    try {
      await update(payload);
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Profil Anda telah diperbarui.",
        timer: 2000,
        showConfirmButton: false,
      });
      if (sigPad.current) sigPad.current.clear();
    } catch (err) {
      console.error("Gagal update", err);

      if (!err.response || err.response.status !== 422) {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: "Terjadi kesalahan saat menyimpan profil.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-[#0D47A1] mb-8 flex items-center gap-2">
        <User className="w-7 h-7" />
        Edit Profile
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
              <div className="relative w-32 h-32 mb-4 group">
                <img
                  src={
                    previews.avatar ||
                    `https://ui-avatars.com/api/?name=${
                      formData.name || "User"
                    }&background=random`
                  }
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover border-4 border-blue-50 shadow-sm"
                />
                <label
                  htmlFor="profile_picture"
                  className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-200"
                >
                  <Upload className="w-6 h-6" />
                </label>
                <input
                  type="file"
                  id="profile_picture"
                  name="profile_picture"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              <h3 className="font-semibold text-gray-900">{formData.name}</h3>
              <p className="text-sm text-gray-500">{formData.email}</p>

              {errors?.profile_picture && (
                <p className="text-red-500 text-xs mt-2">
                  {errors.profile_picture[0]}
                </p>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.name}
                      disabled
                      className="block w-full pl-10 pr-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm text-gray-500 cursor-not-allowed"
                    />
                    <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="block w-full pl-10 pr-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm text-gray-500 cursor-not-allowed"
                    />
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div className="md:col-span-2 border-t pt-4 mt-2">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Key className="w-4 h-4 text-blue-600" />
                    Ganti Password
                  </h4>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password Baru
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Kosongkan jika tidak ingin mengubah password"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors?.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password[0]}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Konfirmasi Password Baru
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="password_confirmation"
                      value={formData.password_confirmation}
                      onChange={handleChange}
                      placeholder="Ulangi password baru"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="md:col-span-2 border-t pt-4 mt-2">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FileSignature className="w-4 h-4 text-blue-600" />
                    E-Signature
                  </h4>
                </div>

                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col items-center justify-center min-h-[150px]">
                    <p className="text-xs font-medium text-gray-500 mb-2">
                      Tanda Tangan Saat Ini
                    </p>
                    {previews.currentSignature ? (
                      <img
                        src={previews.currentSignature}
                        alt="Current Signature"
                        className="max-h-20 object-contain"
                      />
                    ) : (
                      <span className="text-xs text-gray-400 italic">
                        Belum ada tanda tangan
                      </span>
                    )}
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-2">
                      Buat Tanda Tangan Baru
                    </p>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg bg-white overflow-hidden relative">
                      <SignatureCanvas
                        ref={sigPad}
                        penColor="black"
                        canvasProps={{
                          className: "w-full h-32 cursor-crosshair",
                          width: 400,
                          height: 150,
                        }}
                      />
                      <button
                        type="button"
                        onClick={clearSignature}
                        className="absolute top-2 right-2 p-1 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-600 shadow-sm"
                        title="Bersihkan"
                      >
                        <Eraser className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      *Goreskan tanda tangan di kotak ini untuk mengganti yang
                      lama.
                    </p>
                  </div>
                </div>
              </div>

              {/* Tombol Aksi */}
              <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-6 py-2 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#2196F3] hover:bg-blue-600 text-white font-medium px-6 py-2 rounded-lg disabled:bg-gray-400 flex items-center gap-2 shadow-sm"
                >
                  {isSubmitting ? (
                    "Menyimpan..."
                  ) : (
                    <>
                      <Save className="w-4 h-4" /> Simpan Perubahan
                    </>
                  )}
                </button>
              </div>

              {/* Error General */}
              {errors?.general && (
                <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-md text-center">
                  {errors.general}
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProfilePage;
