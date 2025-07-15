import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/Components/Header/Header";
import { ArrowLeft, Edit, Printer, Download } from "lucide-react";

const DetailInventory = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // Data dummy - dalam aplikasi nyata, data ini akan diambil dari API
    const inventoryData = {
        id: 1,
        nama: "Laptop Dell XPS 15",
        kategori: "Elektronik",
        hargaBeli: 25000000,
        merk: "Dell",
        noSeri: "DXPS152022001",
        kondisi: "Baik",
        gambar: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45",
        tanggalPembelian: "2023-05-15",
        supplier: "PT Elektro Mandiri",
        lokasi: "Gudang Utama",
        masaGaransi: "2025-05-15",
        deskripsi: "Laptop high-end untuk kebutuhan desain grafis dan programming",
        dokumen: "invoice_dell_xps.pdf",
        dibuatPada: "2023-05-15 10:30:00",
        diperbaruiPada: "2023-06-20 14:45:00"
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
                    <h2 className="text-2xl font-bold text-[#0D47A1]">Detail Inventory</h2>
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
                            <h3 className="font-semibold text-[#0D47A1]">Foto Barang</h3>
                        </div>
                        <div className="p-4">
                            <img 
                                src={inventoryData.gambar} 
                                alt={inventoryData.nama}
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
                                <p className="text-sm text-gray-500">Kode Inventory</p>
                                <p className="font-medium">INV-{inventoryData.id.toString().padStart(4, '0')}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Tanggal Pembelian</p>
                                <p className="font-medium">{formatDate(inventoryData.tanggalPembelian)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Lokasi Penyimpanan</p>
                                <p className="font-medium">{inventoryData.lokasi}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Status</p>
                                <p className="font-medium">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white ${
                                        inventoryData.kondisi === "Baik" ? "bg-green-500" : 
                                        inventoryData.kondisi === "Rusak Ringan" ? "bg-yellow-500" : "bg-red-500"
                                    }`}>
                                        {inventoryData.kondisi}
                                    </span>
                                </p>
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
                                    onClick={() => navigate(`/edit-inventory/${id}`)}
                                    className="p-2 text-gray-600 hover:text-[#0D47A1] hover:bg-gray-100 rounded-lg transition"
                                >
                                    <Edit className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500">Nama Barang</p>
                                    <p className="font-medium">{inventoryData.nama}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Kategori</p>
                                    <p className="font-medium">{inventoryData.kategori}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Merk</p>
                                    <p className="font-medium">{inventoryData.merk}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Nomor Seri</p>
                                    <p className="font-medium">{inventoryData.noSeri}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500">Harga Beli</p>
                                    <p className="font-medium">{formatCurrency(inventoryData.hargaBeli)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Supplier</p>
                                    <p className="font-medium">{inventoryData.supplier}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Masa Garansi</p>
                                    <p className="font-medium">{formatDate(inventoryData.masaGaransi)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Dokumen Terkait</p>
                                    <a 
                                        href={`/documents/${inventoryData.dokumen}`} 
                                        className="font-medium text-[#2196F3] hover:underline"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {inventoryData.dokumen}
                                    </a>
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <p className="text-sm text-gray-500">Deskripsi</p>
                                <p className="font-medium">{inventoryData.deskripsi}</p>
                            </div>

                            <div className="md:col-span-2 pt-4 border-t">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Dibuat Pada</p>
                                        <p className="font-medium">{inventoryData.dibuatPada}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Diperbarui Pada</p>
                                        <p className="font-medium">{inventoryData.diperbaruiPada}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Riwayat Pemeliharaan */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden mt-6">
                        <div className="p-4 bg-gray-50 border-b">
                            <h3 className="font-semibold text-[#0D47A1]">Riwayat Pemeliharaan</h3>
                        </div>
                        <div className="p-4">
                            <div className="text-center py-8 text-gray-400">
                                <p>Tidak ada riwayat pemeliharaan</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailInventory;