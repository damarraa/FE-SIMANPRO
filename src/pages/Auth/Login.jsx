import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import axios from 'axios';


const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('https://9464e8fe4567.ngrok-free.app/api/v1/login', formData);
      const { token, role, email } = response.data;

      // Simpan token dan informasi user ke localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('userRole', role);
      localStorage.setItem('userEmail', email);

      // Redirect berdasarkan role
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else if (role === 'petugas') {
        navigate('/petugas/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error("Login gagal:", err.response?.data || err.message);
      setError(err.response?.data?.message || 'Login gagal, silakan coba lagi.');
    }
  };

  const handleGoogleLogin = () => {
    // Simulate Google login with a dummy account
    const googleAccount = {
      email: 'google.user@simanpro.com',
      role: 'petugas' // Default role for Google login
    };
    
    localStorage.setItem('authToken', 'google-dummy-token');
    localStorage.setItem('userRole', googleAccount.role);
    localStorage.setItem('userEmail', googleAccount.email);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row w-full">
      {/* Left Side - Branding Section */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-[#1976D2] to-[#2196F3] text-white flex flex-col justify-center items-center p-8 md:p-12">
        <div className="max-w-md text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2">SIMANPRO</h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-6">Masuk ke Sistem</h2>
          <p className="text-lg text-white/90 mb-8">
            Sistem Manajemen Proyek modern yang membantu Anda mengelola proyek secara efisien dan kolaboratif.
          </p>
          <img
            src="/login-illustration.svg"
            alt="Ilustrasi Login"
            className="w-48 md:w-64 mx-auto"
          />
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full md:w-1/2 bg-white flex justify-center items-center">
        <div className="w-full max-w-md bg-white px-6 py-10 rounded-xl shadow-lg">
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-600">Selamat Datang di SIMANPRO</h3>
            <h2 className="text-2xl font-bold text-blue-600">Masuk</h2>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <button 
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-2 bg-blue-100 hover:bg-blue-200 text-sm font-medium text-blue-700 w-full py-2 rounded-md mb-6 transition"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            Masuk menggunakan Google
          </button>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm text-gray-700 mb-1">Masukkan alamat email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="contoh@gmail.com"
                  className="w-full border border-blue-300 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-700 mb-1">Masukkan Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div className="text-right mt-1">
                <button 
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-sm text-blue-500 hover:underline"
                >
                  Lupa Password
                </button>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
            >
              Masuk
            </button>
          </form>

          <div className="text-sm text-center text-gray-500 mt-4">
            Belum Punya Akun?{" "}
            <button 
              onClick={() => navigate('/register')}
              className="text-blue-500 hover:underline"
            >
              Daftar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;