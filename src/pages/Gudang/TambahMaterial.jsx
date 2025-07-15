import React, { useState } from "react";
import Header from "@/Components/Header/Header";
import { Upload, X } from "lucide-react";

const TambahMaterial = () => {
    const [materialData, setMaterialData] = useState({
        namaMaterial: "",
        satuan: "",
        kategori: "",
        jenis: "DPT",
        harga: "",
        minimalStok: "",
        stok: "",
        supplier: "",
        peruntukan: "",
        keterangan: "",
        gambar: null
    });

    const [previewImage, setPreviewImage] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMaterialData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMaterialData(prev => ({ ...prev, gambar: file }));
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setMaterialData(prev => ({ ...prev, gambar: null }));
        setPreviewImage(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission here
        console.log(materialData);
        // You would typically send this data to your backend
    };

    const jenisColors = {
        "DPT": "bg-green-500",
        "Non-DPT": "bg-blue-500",
    };

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-9xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <h1 className="text-2xl font-bold text-[#0D47A1] mb-4 md:mb-0">Tambah Material Baru</h1>
                    <Header />
                </div>

                {/* Material Details Card */}
                <form onSubmit={handleSubmit}>
                    <div className="bg-white rounded-xl shadow-sm mb-8 border border-gray-100">
                        {/* Card Header with blue background */}
                        <div className="bg-[#2196F3] rounded-t-xl p-5 flex md:flex-row justify-between md:items-center">
                            <h2 className="text-xl font-semibold text-white">Detail Material</h2>
                            <select
                                className={`md:w-50 h-10 border rounded-3xl px-8 py-2 text-white focus:outline-none ${jenisColors[materialData.jenis]}`}
                                value={materialData.jenis}
                                name="jenis"
                                onChange={handleChange}
                            >
                                <option value="DPT" className="bg-white text-[#0D47A1]">DPT</option>
                                <option value="Non-DPT" className="bg-white text-[#0D47A1]">Non-DPT</option>
                            </select>
                        </div>

                        {/* Card Content */}
                        <div className="p-4 sm:p-6 space-y-5">
                            {/* Upload Gambar */}
                            <div>
                                <label className="block text-sm font-medium text-[#0D47A1] mb-1">Foto Material</label>
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

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#0D47A1] mb-1">Nama Material*</label>
                                    <input
                                        className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                                        placeholder="Semen Tipe I"
                                        name="namaMaterial"
                                        value={materialData.namaMaterial}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#0D47A1] mb-1">Satuan*</label>
                                    <select
                                        className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                                        name="satuan"
                                        value={materialData.satuan}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Pilih Satuan</option>
                                        <option value="Sak">Sak</option>
                                        <option value="Kg">Kg</option>
                                        <option value="Liter">Liter</option>
                                        <option value="Batang">Batang</option>
                                        <option value="Lembar">Lembar</option>
                                        <option value="Kaleng">Kaleng</option>
                                        <option value="Meter">Meter</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#0D47A1] mb-1">Kategori*</label>
                                    <select
                                        className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                                        name="kategori"
                                        value={materialData.kategori}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Pilih Kategori</option>
                                        <option value="Bangunan">Bangunan</option>
                                        <option value="Pipa">Pipa</option>
                                        <option value="Elektrikal">Elektrikal</option>
                                        <option value="Peralatan">Peralatan</option>
                                        <option value="Cat">Cat</option>
                                        <option value="Besi">Besi</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#0D47A1] mb-1">Harga*</label>
                                    <input
                                        type="number"
                                        className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                                        placeholder="75000"
                                        name="harga"
                                        value={materialData.harga}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#0D47A1] mb-1">Supplier*</label>
                                    <input
                                        className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                                        placeholder="PT Semen Indonesia"
                                        name="supplier"
                                        value={materialData.supplier}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#0D47A1] mb-1">Minimal Stok*</label>
                                    <input
                                        type="number"
                                        className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                                        placeholder="50"
                                        name="minimalStok"
                                        value={materialData.minimalStok}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#0D47A1] mb-1">Stok Awal*</label>
                                    <input
                                        type="number"
                                        className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                                        placeholder="100"
                                        name="stok"
                                        value={materialData.stok}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#0D47A1] mb-1">Peruntukan</label>
                                    <input
                                        className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                                        placeholder="Proyek Konstruksi"
                                        name="peruntukan"
                                        value={materialData.peruntukan}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#0D47A1] mb-1">Keterangan Tambahan</label>
                                <textarea
                                    className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition h-24"
                                    placeholder="Catatan tambahan tentang material..."
                                    name="keterangan"
                                    value={materialData.keterangan}
                                    onChange={handleChange}
                                ></textarea>
                            </div>

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
                                    Simpan Material
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TambahMaterial;