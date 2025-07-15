import React, { useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import Header from "@/Components/Header/Header";

const dummyData = [
    {
        id: 1,
        nama: "Laptop Dell XPS 15",
        kategori: "Elektronik",
        hargaBeli: 25000000,
        merk: "Dell",
        noSeri: "DXPS152022001",
        kondisi: "Baik",
        gambar: "https://example.com/laptop-dell.jpg",
        tanggalPembelian: "2023-05-15",
        supplier: "PT Elektro Mandiri",
        lokasi: "Gudang Utama",
        masaGaransi: "2025-05-15"
    },
    {
        id: 2,
        nama: "Mesin Bor Bosch",
        kategori: "Peralatan",
        hargaBeli: 3500000,
        merk: "Bosch",
        noSeri: "BOSCHBOR2022",
        kondisi: "Baik",
        gambar: "https://example.com/mesin-bor.jpg",
        tanggalPembelian: "2023-02-10",
        supplier: "PT Teknik Jaya",
        lokasi: "Gudang Proyek A",
        masaGaransi: "2024-02-10"
    },
    {
        id: 3,
        nama: "Proyektor Epson",
        kategori: "Elektronik",
        hargaBeli: 8000000,
        merk: "Epson",
        noSeri: "EPSPJ2023",
        kondisi: "Rusak Ringan",
        gambar: "https://example.com/proyektor-epson.jpg",
        tanggalPembelian: "2023-01-20",
        supplier: "PT Visual Tekno",
        lokasi: "Kantor Pusat",
        masaGaransi: "2025-01-20"
    }
];

const kondisiColors = {
    "Baik": "bg-green-500",
    "Rusak Ringan": "bg-yellow-500",
    "Rusak Berat": "bg-red-500"
};

const InventoryList = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const filteredData = dummyData.filter((item) =>
        item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.kategori.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.merk.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const currentData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
    };

    return (
        <div className="p-6 max-w-[1800px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 flex-wrap">
                <h2 className="text-2xl font-bold text-[#0D47A1]">Daftar Inventory</h2>
                <div className="w-full md:w-auto">
                    <Header />
                </div>
            </div>
            
            <div className="flex flex-col md:flex-row justify-end items-start md:items-center mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mb-6 gap-3 flex-wrap">
                    <div className="relative w-full sm:w-auto flex-grow">
                        <Search className="w-4 h-4 absolute top-3 left-3 text-gray-500" />
                        <input
                            type="text"
                            className="pl-10 pr-4 py-2 w-full rounded-lg bg-[#F3F7FA] placeholder:text-sm placeholder:text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent"
                            placeholder="Cari inventory..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => navigate('/tambah-inventory')}
                        className="bg-[#2196F3] hover:bg-blue-600 text-white font-medium px-5 py-2 rounded-lg shadow-md transition-colors duration-200 whitespace-nowrap"
                    >
                        + Tambah Inventory
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1000px] text-left text-gray-700">
                        <thead className="bg-gray-50">
                            <tr className="border-b">
                                <th className="px-6 py-4 font-semibold">No</th>
                                <th className="px-6 py-4 font-semibold">Nama Barang</th>
                                <th className="px-6 py-4 font-semibold">Kategori</th>
                                <th className="px-6 py-4 font-semibold">Merk</th>
                                <th className="px-6 py-4 font-semibold">No Seri</th>
                                <th className="px-6 py-4 font-semibold">Harga Beli</th>
                                <th className="px-6 py-4 font-semibold">Kondisi</th>
                                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {currentData.map((item, index) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                    <td className="px-6 py-4 font-medium text-[#0D47A1]">
                                        {item.nama}
                                    </td>
                                    <td className="px-6 py-4">{item.kategori}</td>
                                    <td className="px-6 py-4">{item.merk}</td>
                                    <td className="px-6 py-4">{item.noSeri}</td>
                                    <td className="px-6 py-4">{formatCurrency(item.hargaBeli)}</td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white ${kondisiColors[item.kondisi] || "bg-gray-400"}`}
                                        >
                                            {item.kondisi}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                onClick={() => navigate(`/detail-inventory/${item.id}`)} 
                                                className="bg-[#2196F3] hover:bg-blue-600 text-white px-3 py-1.5 text-xs rounded-lg transition-colors duration-200"
                                            >
                                                Detail
                                            </button>
                                            <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 text-xs rounded-lg transition-colors duration-200">
                                                Hapus
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {filteredData.length > 0 && (
                    <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 border-t bg-gray-50 gap-2">
                        <span className="text-sm text-gray-600">
                            Menampilkan {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredData.length)} dari {filteredData.length} data
                        </span>
                        <div className="flex gap-1 flex-wrap">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-8 h-8 rounded flex items-center justify-center text-sm ${currentPage === page ? "bg-[#2196F3] text-white" : "text-gray-700 hover:bg-gray-100"} transition-colors duration-200`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InventoryList;