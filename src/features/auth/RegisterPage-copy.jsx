import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { User, Mail, Smartphone, Lock, ArrowLeft } from "lucide-react";

const RegisterPage = () => {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
  });

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      await register(formData);
      navigate("/auth/login", {
        state: { message: "Pendaftaran berhasil! Silakan login." },
      });
    } catch (err) {
      if (err.response && err.response.status === 422) {
        setErrors(err.response.data.errors);
      } else {
        setErrors({
          general:
            err.response?.data?.message ||
            "Pendaftaran gagal, silakan coba lagi.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row w-full">
      {/* Left Side - Branding Section */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-[#1976D2] to-[#2196F3] text-white flex flex-col justify-center items-center p-8 md:p-12">
        <div className="max-w-md text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2">SIMANPRO</h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-6">
            Bergabung dengan Kami
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Mulai kelola proyek Anda dengan lebih efisien menggunakan sistem
            manajemen proyek terintegrasi.
          </p>
          <img
            src="/register-illustration.svg"
            alt="Ilustrasi Daftar"
            className="w-48 md:w-64 mx-auto"
          />
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="w-full md:w-1/2 bg-gray-50 flex justify-center items-center p-6 md:p-12">
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
          <div className="mb-6">
            <button
              onClick={() => navigate("/auth/login")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft size={18} />
              <span className="text-sm">Kembali ke Login</span>
            </button>
          </div>

          <div className="mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              Buat Akun Baru
            </h3>
            <p className="text-gray-600">
              Isi formulir berikut untuk mendaftar
            </p>
          </div>

          {errors.general && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Lengkap
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nama lengkap Anda"
                  required
                  className="block bg-white text-gray-900 w-full pl-10 pr-3 py-2.5 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                />
              </div>
              {errors.name && (
                <p classname="text-red-500 text-xs mt-1">{errors.name[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alamat Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                  className="block bg-white text-gray-900 w-full pl-10 pr-3 py-2.5 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nomor Telepon
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Smartphone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0812-3456-7890"
                  required
                  className="block bg-white text-gray-900 w-full pl-10 pr-3 py-2.5 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="block bg-white text-gray-900 w-full pl-10 pr-3 py-2.5 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password[0]}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Konfirmasi Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="block bg-white text-gray-900 w-full pl-10 pr-3 py-2.5 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                />
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="h-4 w-4 bg-white text-[#2196F3] focus:ring-blue-400 border-blue-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="text-gray-600">
                  Saya setuju dengan{" "}
                  
                  {/* Update version */}
                  {/* <a
                    href="/terms-and-conditions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#2196F3] hover:underline font-medium"
                  >
                    Syarat & Ketentuan
                  </a> */}
                  <a className="bg-white text-[#2196F3] hover:underline">
                    Syarat & Ketentuan
                  </a>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !agreedToTerms}
              className="w-full py-2.5 bg-[#2196F3] hover:bg-[#1976D2] text-white font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:ring-offset-2"
            >
              {loading ? "Memproses..." : "Daftar Sekarang"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Sudah punya akun?{" "}
            <button
              onClick={() => navigate("/auth/login")}
              className="text-[#2196F3] hover:text-[#1565C0] font-medium hover:underline"
            >
              Masuk di sini
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
