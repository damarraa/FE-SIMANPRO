import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Frown, RefreshCw } from 'lucide-react';

const ErrorPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen  from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden p-8 animate-fade-in">
        {/* Error Icon with Animation */}
        <div className="relative mb-6">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <Frown className="w-12 h-12 text-red-500 animate-bounce" />
          </div>
          <div className="absolute -inset-4 border-4 border-red-200 rounded-full animate-ping opacity-75"></div>
        </div>

        {/* Error Message */}
        <h1 className="text-5xl font-bold text-gray-800 mb-3">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Halaman Tidak Ditemukan</h2>
        <p className="text-gray-600 mb-8">
          Maaf, halaman yang Anda cari mungkin telah dipindahkan, dihapus, atau tidak tersedia untuk sementara waktu.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <Home className="w-5 h-5" />
            Kembali ke Beranda
          </button>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-all duration-300"
          >
            <RefreshCw className="w-5 h-5" />
            Muat Ulang
          </button>
        </div>

      </div>

      {/* Custom Animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ErrorPage;