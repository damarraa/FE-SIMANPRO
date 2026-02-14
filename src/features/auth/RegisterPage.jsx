import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import {
  User,
  Mail,
  Smartphone,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  X,
  ShieldCheck,
  FileText,
  Eraser,
  FileSignature
} from "lucide-react";
import Logo from "../../assets/prisan_logo.png";
import Swal from "sweetalert2";
import SignatureCanvas from "react-signature-canvas";

const TermsModal = ({ isOpen, onClose, onAgree }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col transform transition-all">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Syarat & Ketentuan
              </h3>
              <p className="text-sm text-gray-500">
                Penggunaan Sistem ERP SIMANPRO
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto text-sm text-gray-600 leading-relaxed space-y-4">
          <p className="font-medium text-gray-900">1. Definisi</p>
          <p>
            Sistem Manajemen Proyek (SIMANPRO) adalah platform internal milik PT
            PRISAN ARTHA LESTARI yang ditujukan untuk pengelolaan operasional
            perusahaan.
          </p>

          <p className="font-medium text-gray-900">2. Akun dan Keamanan</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Setiap karyawan bertanggung jawab penuh atas keamanan kredensial
              akun (Email & Password).
            </li>
            <li>
              Dilarang meminjamkan atau membagikan akses akun kepada pihak lain,
              termasuk rekan kerja.
            </li>
            <li>
              Segala aktivitas yang terjadi di dalam akun Anda adalah tanggung
              jawab Anda sepenuhnya.
            </li>
          </ul>

          <p className="font-medium text-gray-900">
            3. Kerahasiaan Data (Confidentiality)
          </p>
          <p>
            Seluruh data yang terdapat di dalam SIMANPRO termasuk namun tidak
            terbatas pada data klien, data keuangan, dan data proyek adalah
            bersifat <strong>RAHASIA</strong>. Pengguna dilarang keras
            menyebarluaskan, menyalin, atau menggunakan data tersebut untuk
            kepentingan pribadi atau pihak ketiga tanpa izin tertulis dari
            manajemen.
          </p>

          <p className="font-medium text-gray-900">4. Etika Penggunaan</p>
          <p>
            Pengguna wajib menggunakan sistem ini sesuai dengan SOP perusahaan.
            Penyalahgunaan sistem untuk manipulasi data atau tindakan curang
            lainnya akan dikenakan sanksi tegas sesuai peraturan perusahaan.
          </p>

          <p className="font-medium text-gray-900">5. Pemantauan</p>
          <p>
            Perusahaan berhak memantau log aktivitas pengguna untuk memastikan
            keamanan dan kepatuhan terhadap prosedur operasional.
          </p>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Tutup
          </button>
          <button
            onClick={onAgree}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ShieldCheck className="h-4 w-4" />
            Saya Setuju & Lanjutkan
          </button>
        </div>
      </div>
    </div>
  );
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);

  const sigPad = useRef({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
    signature: null,
  });

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: null }));
    }
    if (errors.general) {
      setErrors((prev) => ({ ...prev, general: null }));
    }
  };

  const clearSignature = () => {
    sigPad.current.clear();
    setFormData((prev) => ({ ...prev, signature: null }));
  }

  const handleAgreeTerms = () => {
    setAgreedToTerms(true);
    setShowTermsModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    if (!agreedToTerms) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      });
      Toast.fire({
        icon: "warning",
        title: "Anda harus menyetujui syarat dan ketentuan",
      });
      setLoading(false);
      return;
    }

    let signatureData = null;
    if (sigPad.current && !sigPad.current.isEmpty()) {
      signatureData = sigPad.current.getCanvas().toDataURL("image/png");
    }

    const payload = {
      ...formData,
      signature: signatureData
    };

    try {
      await register(payload);
      Swal.fire({
        title: "Pendaftaran Berhasil!",
        text: "Akun Anda telah dibuat. Silakan hubungi Admin untuk aktivasi akun.",
        icon: "success",
        confirmButtonText: "Ke Halaman Login",
        confirmButtonColor: "#2563EB",
      }).then(() => {
        navigate("/auth/login");
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
          title: "Mohon periksa inputan formulir Anda.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Pendaftaran Gagal",
          text: err.response?.data?.message || "Terjadi kesalahan pada server.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAgree={handleAgreeTerms}
      />
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-lg flex items-center justify-center mb-4">
            <img src={Logo} alt="PT PRISAN ARTHA LESTARI" className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">SIMANPRO</h2>
          <p className="mt-2 text-sm text-gray-600">Sistem Manajemen Proyek</p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <button
            onClick={() => navigate("/auth/login")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 text-sm"
          >
            <ArrowLeft size={16} />
            Kembali ke Login
          </button>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 text-center">
              Buat akun baru
            </h3>
            <p className="text-sm text-gray-600 text-center mt-1">
              Isi formulir berikut untuk mendaftar
            </p>
          </div>

          {errors.general && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{errors.general}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nama Lengkap
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nama lengkap Anda"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-xs mt-2">{errors.name[0]}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Alamat Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="nama@perusahaan.com"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-2">{errors.email[0]}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nomor Telepon
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Smartphone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0812-3456-7890"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-xs mt-2">{errors.phone[0]}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Masukkan password"
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-2">
                  {errors.password[0]}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password_confirmation"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Konfirmasi Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password_confirmation"
                  name="password_confirmation"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  placeholder="Konfirmasi password"
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FileSignature className="h-4 w-4" />
                Tanda Tangan Elektronik
              </label>
              <div className="relative border border-gray-300 rounded-lg bg-white overflow-hidden">
                <SignatureCanvas
                  ref={sigPad}
                  penColor="black"
                  canvasProps={{
                    className: "w-full h-32 cursor-crosshair bg-white",
                    // Hapus width/height fix agar responsive mengikuti parent
                  }}
                />
                <div className="absolute top-2 right-2">
                  <button
                    type="button"
                    onClick={clearSignature}
                    className="p-1 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-600 shadow-sm transition-colors"
                    title="Bersihkan Tanda Tangan"
                  >
                    <Eraser className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                *Silakan buat tanda tangan Anda di dalam kotak di atas.
              </p>
              {errors.signature && (
                <p className="text-red-500 text-xs mt-2">{errors.signature[0]}</p>
              )}
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="text-gray-600">
                  Saya setuju dengan{" "}
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    className="text-blue-600 hover:text-blue-500 font-medium underline focus:outline-none"
                  >
                    Syarat & Ketentuan
                  </button>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !agreedToTerms}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Memproses...
                </div>
              ) : (
                "Daftar Sekarang"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Sudah punya akun?{" "}
              <button
                onClick={() => navigate("/auth/login")}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Masuk di sini
              </button>
            </p>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            © 2025 SIMANPRO. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
