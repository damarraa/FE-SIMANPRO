import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/Components/Header/Header";
import { ArrowLeft, Edit, Printer, Download } from "lucide-react";

const DetailMaterial = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // Data dummy - dalam aplikasi nyata, data ini akan diambil dari API
    const materialData = {
        id: 1,
        namaMaterial: "Semen Tipe I",
        satuan: "Sak",
        kategori: "Bangunan",
        jenis: "DPT",
        harga: 75000,
        minimalStok: 50,
        stok: 120,
        supplier: "PT Semen Indonesia",
        peruntukan: "Proyek Konstruksi",
        gambar: "https://images.unsplash.com/photo-1605030753481-bb38b08c384a",
        keterangan: "Semen Portland Type I untuk konstruksi umum",
        dibuatPada: "2023-05-15 10:30:00",
        diperbaruiPada: "2023-06-20 14:45:00"
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
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
                    <h2 className="text-2xl font-bold text-[#0D47A1]">Detail Material</h2>
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
                            <h3 className="font-semibold text-[#0D47A1]">Foto Material</h3>
                        </div>
                        <div className="p-4">
                            <img 
                                src={materialData.gambar} 
                                alt={materialData.namaMaterial}
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
                                <p className="text-sm text-gray-500">Kode Material</p>
                                <p className="font-medium">MAT-{materialData.id.toString().padStart(4, '0')}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Jenis Material</p>
                                <p className="font-medium">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white ${
                                        materialData.jenis === "DPT" ? "bg-green-500" : "bg-blue-500"
                                    }`}>
                                        {materialData.jenis}
                                    </span>
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Satuan</p>
                                <p className="font-medium">{materialData.satuan}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Kategori</p>
                                <p className="font-medium">{materialData.kategori}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Kolom tengah dan kanan - Detail lengkap */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                            <h3 className="font-semibold text-[#0D47A1]">Informasi Lengkap</h3>
                            <div className="flex gap-2">
                                <button className="p-2 text-gray-600 hover:text-[#0D47A1] hover:bg-gray-100 rounded-lg transition">
                                    <Printer className="w-5 h-5" />
                                </button>
                                <button className="p-2 text-gray-600 hover:text-[#0D47A1] hover:bg-gray-100 rounded-lg transition">
                                    <Download className="w-5 h-5" />
                                </button>
                                <button 
                                    onClick={() => navigate(`/edit-material/${id}`)}
                                    className="p-2 text-gray-600 hover:text-[#0D47A1] hover:bg-gray-100 rounded-lg transition"
                                >
                                    <Edit className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500">Nama Material</p>
                                    <p className="font-medium">{materialData.namaMaterial}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Harga</p>
                                    <p className="font-medium">{formatCurrency(materialData.harga)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Stok Tersedia</p>
                                    <p className={`font-medium ${
                                        materialData.stok < materialData.minimalStok ? 'text-red-500' : 'text-green-500'
                                    }`}>
                                        {materialData.stok} {materialData.satuan}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500">Minimal Stok</p>
                                    <p className="font-medium">{materialData.minimalStok} {materialData.satuan}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Supplier</p>
                                    <p className="font-medium">{materialData.supplier}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Peruntukan</p>
                                    <p className="font-medium">{materialData.peruntukan}</p>
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <p className="text-sm text-gray-500">Keterangan</p>
                                <p className="font-medium">{materialData.keterangan}</p>
                            </div>

                            <div className="md:col-span-2 pt-4 border-t">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Dibuat Pada</p>
                                        <p className="font-medium">{formatDate(materialData.dibuatPada)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Diperbarui Pada</p>
                                        <p className="font-medium">{formatDate(materialData.diperbaruiPada)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Riwayat Transaksi */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden mt-6">
                        <div className="p-4 bg-gray-50 border-b">
                            <h3 className="font-semibold text-[#0D47A1]">Riwayat Transaksi</h3>
                        </div>
                        <div className="p-4">
                            <div className="text-center py-8 text-gray-400">
                                <p>Tidak ada riwayat transaksi</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailMaterial;