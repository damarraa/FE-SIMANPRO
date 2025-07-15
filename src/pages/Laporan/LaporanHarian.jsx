import React, { useState } from "react";
import Header from "@/Components/Header/Header";
import { useNavigate } from "react-router-dom";
import { X, Plus, Trash2 } from "lucide-react";

const LaporanHarian = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    proyek: "",
    lokasi: "",
    jamKerja: "",
    tanggal: "",
    keterangan: "",
  });

  const [petugas, setPetugas] = useState([{ nama: "", keahlian: "" }]);
  const [pekerjaan, setPekerjaan] = useState([{ nama: "", volume: "", satuan: "" }]);
  const [material, setMaterial] = useState([{ nama: "", jumlah: "" }]);
  const [alat, setAlat] = useState([{ nama: "", jumlah: "" }]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDynamicChange = (setter, index, e) => {
    const { name, value } = e.target;
    setter((prev) => {
      const updated = [...prev];
      updated[index][name] = value;
      return updated;
    });
  };

  const addRow = (setter, data) => setter((prev) => [...prev, data]);
  const removeRow = (setter, index) => setter((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSend = {
      ...formData,
      petugas,
      pekerjaan,
      material,
      alat,
    };
    console.log(dataToSend);
    navigate("/laporan");
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="max-w-9xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-2xl font-bold text-[#0D47A1] mb-4 md:mb-0">Laporan Harian Proyek</h1>
          <Header />
        </div>

        <form onSubmit={handleSubmit}>
          {/* Informasi Umum */}
          <div className="bg-white rounded-xl shadow-sm mb-8 border border-gray-100">
            <div className="bg-[#2196F3] rounded-t-xl p-5">
              <h2 className="text-xl font-semibold text-white">Informasi Umum</h2>
            </div>

            <div className="p-4 sm:p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Kolom kiri */}
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-[#0D47A1] mb-1">Nama Proyek*</label>
                    <input
                      className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                      placeholder="Proyek Pembangunan Gedung A"
                      name="proyek"
                      value={formData.proyek}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#0D47A1] mb-1">Jam Kerja*</label>
                    <input
                      className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                      placeholder="08:00 - 17:00"
                      name="jamKerja"
                      value={formData.jamKerja}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Kolom kanan */}
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-[#0D47A1] mb-1">Lokasi Proyek*</label>
                    <input
                      className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                      placeholder="Jl. Sudirman No. 123"
                      name="lokasi"
                      value={formData.lokasi}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#0D47A1] mb-1">Tanggal*</label>
                    <input
                      type="date"
                      className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                      name="tanggal"
                      value={formData.tanggal}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Keterangan */}
              <div>
                <label className="block text-sm font-medium text-[#0D47A1] mb-1">Keterangan</label>
                <textarea
                  className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition h-24"
                  placeholder="Tambahkan keterangan tambahan..."
                  name="keterangan"
                  value={formData.keterangan}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
          </div>

          {/* Detail Petugas */}
          <div className="bg-white rounded-xl shadow-sm mb-8 border border-gray-100">
            <div className="bg-[#2196F3] rounded-t-xl p-5">
              <h2 className="text-xl font-semibold text-white">Detail Petugas</h2>
            </div>

            <div className="p-4 sm:p-6 space-y-5">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#0D47A1] uppercase tracking-wider">Nama Petugas</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#0D47A1] uppercase tracking-wider">Keahlian</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-[#0D47A1] uppercase tracking-wider w-10">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {petugas.map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                            placeholder="Nama lengkap petugas"
                            name="nama"
                            value={row.nama}
                            onChange={(e) => handleDynamicChange(setPetugas, i, e)}
                            required
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                            placeholder="Keahlian/keterampilan"
                            name="keahlian"
                            value={row.keahlian}
                            onChange={(e) => handleDynamicChange(setPetugas, i, e)}
                            required
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          {petugas.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeRow(setPetugas, i)}
                              className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                              title="Hapus Petugas"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                type="button"
                onClick={() => addRow(setPetugas, { nama: "", keahlian: "" })}
                className="text-[#2196F3] hover:text-blue-600 font-medium flex items-center gap-2 text-sm"
              >
                <span className="bg-blue-100 text-[#2196F3] rounded-full p-1">
                  <Plus className="h-4 w-4" />
                </span>
                Tambah Petugas
              </button>
            </div>
          </div>

          {/* Detail Pekerjaan */}
          <div className="bg-white rounded-xl shadow-sm mb-8 border border-gray-100">
            <div className="bg-[#2196F3] rounded-t-xl p-5">
              <h2 className="text-xl font-semibold text-white">Detail Pekerjaan</h2>
            </div>

            <div className="p-4 sm:p-6 space-y-5">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#0D47A1] uppercase tracking-wider">Nama Pekerjaan</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#0D47A1] uppercase tracking-wider">Volume</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#0D47A1] uppercase tracking-wider">Satuan</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-[#0D47A1] uppercase tracking-wider w-10">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pekerjaan.map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                            placeholder="Deskripsi pekerjaan"
                            name="nama"
                            value={row.nama}
                            onChange={(e) => handleDynamicChange(setPekerjaan, i, e)}
                            required
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                            placeholder="0"
                            name="volume"
                            value={row.volume}
                            onChange={(e) => handleDynamicChange(setPekerjaan, i, e)}
                            required
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                            name="satuan"
                            value={row.satuan}
                            onChange={(e) => handleDynamicChange(setPekerjaan, i, e)}
                            required
                          >
                            <option value="">Pilih satuan</option>
                            <option value="m">meter (m)</option>
                            <option value="m2">meter persegi (m²)</option>
                            <option value="m3">meter kubik (m³)</option>
                            <option value="unit">unit</option>
                            <option value="kg">kilogram (kg)</option>
                            <option value="hari">hari</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          {pekerjaan.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeRow(setPekerjaan, i)}
                              className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                              title="Hapus Pekerjaan"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                type="button"
                onClick={() => addRow(setPekerjaan, { nama: "", volume: "", satuan: "" })}
                className="text-[#2196F3] hover:text-blue-600 font-medium flex items-center gap-2 text-sm"
              >
                <span className="bg-blue-100 text-[#2196F3] rounded-full p-1">
                  <Plus className="h-4 w-4" />
                </span>
                Tambah Pekerjaan
              </button>
            </div>
          </div>

          {/* Penggunaan Material */}
          <div className="bg-white rounded-xl shadow-sm mb-8 border border-gray-100">
            <div className="bg-[#2196F3] rounded-t-xl p-5">
              <h2 className="text-xl font-semibold text-white">Penggunaan Material</h2>
            </div>

            <div className="p-4 sm:p-6 space-y-5">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#0D47A1] uppercase tracking-wider">Nama Material</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#0D47A1] uppercase tracking-wider">Jumlah</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-[#0D47A1] uppercase tracking-wider w-10">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {material.map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                            placeholder="Nama material/bahan"
                            name="nama"
                            value={row.nama}
                            onChange={(e) => handleDynamicChange(setMaterial, i, e)}
                            required
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                            placeholder="0"
                            name="jumlah"
                            value={row.jumlah}
                            onChange={(e) => handleDynamicChange(setMaterial, i, e)}
                            required
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          {material.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeRow(setMaterial, i)}
                              className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                              title="Hapus Material"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                type="button"
                onClick={() => addRow(setMaterial, { nama: "", jumlah: "" })}
                className="text-[#2196F3] hover:text-blue-600 font-medium flex items-center gap-2 text-sm"
              >
                <span className="bg-blue-100 text-[#2196F3] rounded-full p-1">
                  <Plus className="h-4 w-4" />
                </span>
                Tambah Material
              </button>
            </div>
          </div>

          {/* Penggunaan Alat */}
          <div className="bg-white rounded-xl shadow-sm mb-8 border border-gray-100">
            <div className="bg-[#2196F3] rounded-t-xl p-5">
              <h2 className="text-xl font-semibold text-white">Penggunaan Alat</h2>
            </div>

            <div className="p-4 sm:p-6 space-y-5">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#0D47A1] uppercase tracking-wider">Nama Alat</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#0D47A1] uppercase tracking-wider">Jumlah</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-[#0D47A1] uppercase tracking-wider w-10">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {alat.map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                            placeholder="Nama alat/perlengkapan"
                            name="nama"
                            value={row.nama}
                            onChange={(e) => handleDynamicChange(setAlat, i, e)}
                            required
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                            placeholder="0"
                            name="jumlah"
                            value={row.jumlah}
                            onChange={(e) => handleDynamicChange(setAlat, i, e)}
                            required
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          {alat.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeRow(setAlat, i)}
                              className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                              title="Hapus Alat"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                type="button"
                onClick={() => addRow(setAlat, { nama: "", jumlah: "" })}
                className="text-[#2196F3] hover:text-blue-600 font-medium flex items-center gap-2 text-sm"
              >
                <span className="bg-blue-100 text-[#2196F3] rounded-full p-1">
                  <Plus className="h-4 w-4" />
                </span>
                Tambah Alat
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4 sticky bottom-0 bg-white p-4 border-t border-gray-200 -mx-6 -mb-8">
            <button
              type="button"
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium px-6 py-2 rounded-lg shadow-md transition-colors duration-200"
              onClick={() => navigate("/laporan")}
            >
              Batal
            </button>
            <button
              type="button"
              className="bg-white text-[#2196F3] hover:bg-blue-50 font-medium px-6 py-2 rounded-lg border border-[#2196F3] shadow-md transition-colors duration-200"
            >
              Simpan Draft
            </button>
            <button
              type="submit"
              className="bg-[#2196F3] hover:bg-blue-600 text-white font-medium px-6 py-2 rounded-lg shadow-md transition-colors duration-200"
            >
              Submit Laporan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LaporanHarian;