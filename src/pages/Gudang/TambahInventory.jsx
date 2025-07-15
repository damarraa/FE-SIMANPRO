import React, { useState } from "react";
import Header from "@/Components/Header/Header";
import { Upload, X } from "lucide-react";

const TambahInventory = () => {
    const [inventoryData, setInventoryData] = useState({
        nama: "",
        kategori: "",
        hargaBeli: "",
        merk: "",
        noSeri: "",
        kondisi: "Baik",
        gambar: null,
        tanggalPembelian: "",
        supplier: "",
        lokasi: "",
        masaGaransi: "",
        deskripsi: "",
        dokumen: null
    });

    const [previewImage, setPreviewImage] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInventoryData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setInventoryData(prev => ({ ...prev, gambar: file }));
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setInventoryData(prev => ({ ...prev, gambar: null }));
        setPreviewImage(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission here
        console.log(inventoryData);
        // You would typically send this data to your backend
    };

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-9xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <h1 className="text-2xl font-bold text-[#0D47A1] mb-4 md:mb-0">Tambah Inventory Baru</h1>
                    <Header />
                </div>

                {/* Inventory Details Card */}
                <form onSubmit={handleSubmit}>
                    <div className="bg-white rounded-xl shadow-sm mb-8 border border-gray-100">
                        {/* Card Header with blue background */}
                        <div className="bg-[#2196F3] rounded-t-xl p-5">
                            <h2 className="text-xl font-semibold text-white">Detail Inventory</h2>
                        </div>

                        {/* Card Content */}
                        <div className="p-4 sm:p-6 space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Kolom kiri */}
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-[#0D47A1] mb-1">Nama Barang*</label>
                                        <input
                                            className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                                            placeholder="Laptop Dell XPS 15"
                                            name="nama"
                                            value={inventoryData.nama}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[#0D47A1] mb-1">Kategori*</label>
                                        <select
                                            className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                                            name="kategori"
                                            value={inventoryData.kategori}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Pilih Kategori</option>
                                            <option value="Elektronik">Elektronik</option>
                                            <option value="Peralatan">Peralatan</option>
                                            <option value="Kendaraan">Kendaraan</option>
                                            <option value="Furniture">Furniture</option>
                                            <option value="Alat Tulis">Alat Tulis</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[#0D47A1] mb-1">Merk</label>
                                        <input
                                            className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                                            placeholder="Dell"
                                            name="merk"
                                            value={inventoryData.merk}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[#0D47A1] mb-1">Nomor Seri</label>
                                        <input
                                            className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                                            placeholder="DXPS152022001"
                                            name="noSeri"
                                            value={inventoryData.noSeri}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[#0D47A1] mb-1">Kondisi*</label>
                                        <select
                                            className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                                            name="kondisi"
                                            value={inventoryData.kondisi}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="Baik">Baik</option>
                                            <option value="Rusak Ringan">Rusak Ringan</option>
                                            <option value="Rusak Berat">Rusak Berat</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Kolom kanan */}
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-[#0D47A1] mb-1">Harga Beli*</label>
                                        <input
                                            type="number"
                                            className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                                            placeholder="25000000"
                                            name="hargaBeli"
                                            value={inventoryData.hargaBeli}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[#0D47A1] mb-1">Tanggal Pembelian*</label>
                                        <input
                                            type="date"
                                            className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                                            name="tanggalPembelian"
                                            value={inventoryData.tanggalPembelian}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[#0D47A1] mb-1">Supplier</label>
                                        <input
                                            className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                                            placeholder="PT Elektro Mandiri"
                                            name="supplier"
                                            value={inventoryData.supplier}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[#0D47A1] mb-1">Lokasi Penyimpanan*</label>
                                        <select
                                            className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                                            name="lokasi"
                                            value={inventoryData.lokasi}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Pilih Lokasi</option>
                                            <option value="Gudang Utama">Gudang Utama</option>
                                            <option value="Gudang Proyek A">Gudang Proyek A</option>
                                            <option value="Gudang Proyek B">Gudang Proyek B</option>
                                            <option value="Kantor Pusat">Kantor Pusat</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[#0D47A1] mb-1">Masa Garansi</label>
                                        <input
                                            type="date"
                                            className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                                            name="masaGaransi"
                                            value={inventoryData.masaGaransi}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Upload Gambar */}
                            <div>
                                <label className="block text-sm font-medium text-[#0D47A1] mb-1">Foto Barang</label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                                    <div className="space-y-1 text-center">
                                        {previewImage ? (
                                            <div className="relative">
                                                <img 
                                                    src={previewImage} 
                                                    alt="Preview" 
                                                    className="mx-auto h-48 object-contain"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={removeImage}
                                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex justify-center">
                                                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                                </div>
                                                <div className="flex text-sm text-gray-600">
                                                    <label
                                                        htmlFor="file-upload"
                                                        className="relative cursor-pointer bg-white rounded-md font-medium text-[#2196F3] hover:text-blue-500 focus-within:outline-none"
                                                    >
                                                        <span>Upload file</span>
                                                        <input
                                                            id="file-upload"
                                                            name="file-upload"
                                                            type="file"
                                                            className="sr-only"
                                                            onChange={handleFileChange}
                                                            accept="image/*"
                                                        />
                                                    </label>
                                                    <p className="pl-1">atau drag and drop</p>
                                                </div>
                                                <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 5MB</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Deskripsi */}
                            <div>
                                <label className="block text-sm font-medium text-[#0D47A1] mb-1">Deskripsi</label>
                                <textarea
                                    className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition h-24"
                                    placeholder="Deskripsi lengkap tentang barang..."
                                    name="deskripsi"
                                    value={inventoryData.deskripsi}
                                    onChange={handleChange}
                                ></textarea>
                            </div>

                            {/* Upload Dokumen */}
                            <div>
                                <label className="block text-sm font-medium text-[#0D47A1] mb-1">Dokumen Terkait (Invoice/Surat Garansi)</label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                                    <div className="space-y-1 text-center">
                                        <div className="flex justify-center">
                                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                        </div>
                                        <div className="flex text-sm text-gray-600">
                                            <label
                                                htmlFor="doc-upload"
                                                className="relative cursor-pointer bg-white rounded-md font-medium text-[#2196F3] hover:text-blue-500 focus-within:outline-none"
                                            >
                                                <span>Upload dokumen</span>
                                                <input
                                                    id="doc-upload"
                                                    name="doc-upload"
                                                    type="file"
                                                    className="sr-only"
                                                    onChange={(e) => setInventoryData(prev => ({ ...prev, dokumen: e.target.files[0] }))}
                                                    accept=".pdf,.doc,.docx"
                                                />
                                            </label>
                                            <p className="pl-1">PDF, DOC, DOCX up to 10MB</p>
                                        </div>
                                        {inventoryData.dokumen && (
                                            <p className="text-sm text-gray-900">{inventoryData.dokumen.name}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-4 pt-4">
                                <button
                                    type="button"
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium px-6 py-2 rounded-lg shadow-md transition-colors duration-200"
                                    onClick={() => window.history.back()}
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="bg-[#2196F3] hover:bg-blue-600 text-white font-medium px-6 py-2 rounded-lg shadow-md transition-colors duration-200"
                                >
                                    Simpan Inventory
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TambahInventory;