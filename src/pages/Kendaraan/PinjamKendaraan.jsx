import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Calendar, User, MapPin, Clock } from "lucide-react";
import Header from "@/Components/Header/Header";

const FormPinjamKendaraan = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // In a real app, you would fetch this data from an API
  const vehicleData = {
    id: 1,
    jenis: "Kendaraan",
    merk: "Toyota",
    model: "Hiace",
    noPolisi: "B 1234 ABC",
    kmTerakhir: "45.780"
  };

  const [borrowData, setBorrowData] = useState({
    kendaraanId: id,
    tanggalPinjam: "",
    tanggalKembali: "",
    peminjam: "",
    proyek: "",
    tujuan: "",
    kmAwal: vehicleData.kmTerakhir,
    kmAkhir: "",
    catatan: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBorrowData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(borrowData);
    // Handle form submission
    navigate('/kendaraan');
  };

  return (
    <div className="p-6 max-w-[1800px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 flex-wrap">
        <h2 className="text-2xl font-bold text-[#0D47A1]">Form Peminjaman Kendaraan</h2>
        <div className="w-full md:w-auto">
          <Header />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div className=" bg-[#2196F3] rounded-t-xl p-5">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">Informasi Kendaraan</h2>
          </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Jenis</p>
              <p className="font-medium text-[#0D47A1]">{vehicleData.jenis}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Merk/Model</p>
              <p className="font-medium text-[#0D47A1]">{vehicleData.merk} {vehicleData.model}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">No Polisi</p>
              <p className="font-medium text-[#0D47A1]">{vehicleData.noPolisi}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">KM Terakhir</p>
              <p className="font-medium text-[#0D47A1]">{vehicleData.kmTerakhir} km</p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
         <div className=" bg-[#2196F3] rounded-t-xl p-5">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2"> Data Peminjaman</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#0D47A1] mb-1 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Tanggal Pinjam*
                </label>
                <input
                  type="datetime-local"
                  className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                  name="tanggalPinjam"
                  value={borrowData.tanggalPinjam}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0D47A1] mb-1 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Tanggal Kembali*
                </label>
                <input
                  type="datetime-local"
                  className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                  name="tanggalKembali"
                  value={borrowData.tanggalKembali}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0D47A1] mb-1 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Peminjam*
                </label>
                <input
                  className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                  placeholder="Nama Peminjam"
                  name="peminjam"
                  value={borrowData.peminjam}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#0D47A1] mb-1 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Proyek*
                </label>
                <select
                  className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                  name="proyek"
                  value={borrowData.proyek}
                  onChange={handleChange}
                  required
                >
                  <option value="">Pilih Proyek</option>
                  <option value="Proyek A">Proyek A</option>
                  <option value="Proyek B">Proyek B</option>
                  <option value="Proyek C">Proyek C</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0D47A1] mb-1 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Tujuan*
                </label>
                <input
                  className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                  placeholder="Tujuan penggunaan"
                  name="tujuan"
                  value={borrowData.tujuan}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0D47A1] mb-1 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  KM Awal*
                </label>
                <input
                  type="number"
                  className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                  placeholder="KM saat pinjam"
                  name="kmAwal"
                  value={borrowData.kmAwal}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#0D47A1] mb-1">Catatan</label>
              <textarea
                className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition h-24"
                placeholder="Catatan tambahan..."
                name="catatan"
                value={borrowData.catatan}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium px-6 py-2 rounded-lg shadow-md transition-colors duration-200"
            onClick={() => navigate('/kendaraan')}
          >
            Batal
          </button>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-lg shadow-md transition-colors duration-200"
          >
            Submit Peminjaman
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormPinjamKendaraan;