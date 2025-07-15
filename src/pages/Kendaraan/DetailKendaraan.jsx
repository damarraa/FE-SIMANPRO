import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Calendar, Wrench, Clock, Truck, Construction } from "lucide-react";
import Header from "@/Components/Header/Header";

const DetailKendaraan = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const vehicleData = {
    id: 1,
    jenis: "Kendaraan",
    merk: "Toyota",
    model: "Hiace",
    tipe: "Minibus",
    noPolisi: "B 1234 ABC",
    tahunPembelian: 2020,
    kapasitas: "8 Orang",
    lokasi: "Gudang Utama",
    status: "Tersedia",
    gambar: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d",
    nomorRangka: "MHTCV81J6K1234567",
    nomorMesin: "2KD-FTV1234567",
    bahanBakar: "Solar",
    kmTerakhir: "45.780",
    pemilik: "Perusahaan",
    keterangan: "Kendaraan operasional proyek",
    riwayatPerbaikan: [
      {
        id: 1,
        tanggal: "2023-05-15",
        jenis: "Servis Rutin",
        lokasi: "Bengkel Resmi Toyota",
        biaya: 2500000,
        kmSaatPerbaikan: "42.500",
        keterangan: "Ganti oli, filter, dan pemeriksaan umum"
      },
      {
        id: 2,
        tanggal: "2023-02-10",
        jenis: "Perbaikan",
        lokasi: "Bengkel Proyek",
        biaya: 1500000,
        kmSaatPerbaikan: "38.200",
        keterangan: "Perbaikan sistem rem"
      }
    ],
    riwayatPeminjaman: [
      {
        id: 1,
        tanggalPinjam: "2023-06-01",
        tanggalKembali: "2023-06-05",
        peminjam: "Budi Santoso",
        proyek: "Pembangunan Jalan A",
        tujuan: "Transportasi tim ke lokasi proyek",
        kmAwal: "43.200",
        kmAkhir: "43.850"
      }
    ]
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  return (
    <div className="p-6 max-w-[1800px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="text-2xl font-bold text-[#0D47A1] flex items-center gap-2">
            {vehicleData.jenis === "Alat Berat" ? (
              <Construction className="w-6 h-6" />
            ) : (
              <Truck className="w-6 h-6" />
            )}
            Detail {vehicleData.jenis}
          </h2>
        </div>
        <div className="w-full md:w-auto">
          <Header />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom kiri - Gambar dan info dasar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-4 bg-gray-50 border-b">
              <h3 className="font-semibold text-[#0D47A1]">Foto Kendaraan</h3>
            </div>
            <div className="p-4">
              <img 
                src={vehicleData.gambar} 
                alt={`${vehicleData.merk} ${vehicleData.model}`}
                className="w-full h-64 object-contain rounded-lg border border-gray-200"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden mt-6">
            <div className="p-4 bg-gray-50 border-b">
              <h3 className="font-semibold text-[#0D47A1]">Informasi Dasar</h3>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <p className="text-sm text-gray-500">Kode Kendaraan</p>
                <p className="font-medium">KD-{vehicleData.id.toString().padStart(4, '0')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white ${
                    vehicleData.status === "Tersedia" ? "bg-green-500" : 
                    vehicleData.status === "Dipinjam" ? "bg-yellow-500" : "bg-red-500"
                  }`}>
                    {vehicleData.status}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Lokasi Saat Ini</p>
                <p className="font-medium">{vehicleData.lokasi}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">KM Terakhir</p>
                <p className="font-medium">{vehicleData.kmTerakhir} km</p>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom tengah dan kanan - Detail lengkap */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
              <h3 className="font-semibold text-[#0D47A1]">Spesifikasi Teknis</h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => navigate(`/kendaraan/edit/${id}`)}
                  className="p-2 text-gray-600 hover:text-[#0D47A1] hover:bg-gray-100 rounded-lg transition"
                >
                  <Edit className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Merk/Model</p>
                  <p className="font-medium">{vehicleData.merk} {vehicleData.model}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tipe</p>
                  <p className="font-medium">{vehicleData.tipe}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nomor Polisi</p>
                  <p className="font-medium">{vehicleData.noPolisi}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tahun Pembelian</p>
                  <p className="font-medium">{vehicleData.tahunPembelian}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Nomor Rangka</p>
                  <p className="font-medium">{vehicleData.nomorRangka}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nomor Mesin</p>
                  <p className="font-medium">{vehicleData.nomorMesin}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Bahan Bakar</p>
                  <p className="font-medium">{vehicleData.bahanBakar}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Kapasitas</p>
                  <p className="font-medium">{vehicleData.kapasitas}</p>
                </div>
              </div>

              <div className="md:col-span-2">
                <p className="text-sm text-gray-500">Keterangan</p>
                <p className="font-medium">{vehicleData.keterangan}</p>
              </div>
            </div>
          </div>

          {/* Riwayat Perbaikan */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mt-6">
            <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
              <h3 className="font-semibold text-[#0D47A1] flex items-center gap-2">
                <Wrench className="w-5 h-5" />
                Riwayat Perbaikan
              </h3>
              <button 
                onClick={() => navigate(`/kendaraan/perbaikan`)}
                className="text-sm bg-[#2196F3] hover:bg-blue-600 text-white px-3 py-1 rounded-lg"
              >
                + Tambah Perbaikan
              </button>
            </div>
            <div className="p-4">
              {vehicleData.riwayatPerbaikan.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lokasi</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Biaya</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KM</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {vehicleData.riwayatPerbaikan.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 cursor-pointer">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(item.tanggal)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.jenis}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.lokasi}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(item.biaya)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.kmSaatPerbaikan} km</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <p>Tidak ada riwayat perbaikan</p>
                </div>
              )}
            </div>
          </div>

          {/* Riwayat Peminjaman */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mt-6">
            <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
              <h3 className="font-semibold text-[#0D47A1] flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Riwayat Peminjaman
              </h3>
            </div>
            <div className="p-4">
              {vehicleData.riwayatPeminjaman.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Peminjam</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proyek</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KM</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {vehicleData.riwayatPeminjaman.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(item.tanggalPinjam)} - {formatDate(item.tanggalKembali)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.peminjam}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.proyek}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.kmAwal} → {item.kmAkhir} km
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <p>Tidak ada riwayat peminjaman</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailKendaraan;