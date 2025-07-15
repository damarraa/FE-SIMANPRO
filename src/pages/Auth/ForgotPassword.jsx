import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, Check } from 'lucide-react';
import Header from "@/Components/Header/Header";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Reset password for:', email);
    setIsSubmitted(true);
  };

  return (
    <div className="h-screen flex flex-col md:flex-row w-full overflow-hidden"> {/* Changed min-h-screen to h-screen and added overflow-hidden */}
      {/* Left Side - Branding Section */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-[#1976D2] to-[#2196F3] text-white flex flex-col justify-center items-center p-8 md:p-12 overflow-y-auto"> {/* Added overflow-y-auto */}
        <div className="max-w-md text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2">SIMANPRO</h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-6">Reset Password</h2>
          <p className="text-lg text-white/90 mb-8">
            Kami akan membantu Anda mendapatkan akses kembali ke akun Anda.
          </p>
          <img 
            src="/password-reset-illustration.svg" 
            alt="Ilustrasi Reset Password" 
            className="w-48 md:w-64 mx-auto" 
          />
        </div>
      </div>

      {/* Right Side - Form Section */}
      <div className="w-full md:w-1/2 bg-gray-50 flex justify-center items-center p-6 md:p-12 overflow-y-auto"> {/* Added overflow-y-auto */}
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
          <div className="mb-6">
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft size={18} />
              <span className="text-sm">Kembali ke Login</span>
            </button>
          </div>

          {isSubmitted ? (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Email Terkirim!</h3>
              <p className="text-gray-600 mb-6">
                Kami telah mengirimkan instruksi reset password ke email Anda. Silakan periksa inbox Anda.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-2.5 bg-[#2196F3] hover:bg-[#1976D2] text-white font-semibold rounded-lg transition-colors"
              >
                Kembali ke Login
              </button>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Lupa Password</h3>
                <p className="text-gray-600">
                  Masukkan alamat email yang terdaftar untuk menerima link reset password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@contoh.com"
                      required
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#2196F3] hover:bg-[#1976D2] text-white font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:ring-offset-2"
                >
                  Kirim Instruksi Reset
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-gray-600">
                Tidak menerima email?{' '}
                <button className="text-[#2196F3] hover:text-[#1565C0] font-medium hover:underline">
                  Kirim ulang
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;