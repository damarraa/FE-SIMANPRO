import React, { useState } from "react";
import { Search, Warehouse, Plus } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import Header from "@/Components/Header/Header";

const dummyData = [
    {
        id: 1,
        namaGudang: "Gudang Pusat Jakarta",
        alamat: "Jl. Sudirman No. 123, Jakarta Selatan",
        pic: "Budi Santoso",
        kontak: "0812-3456-7890",
        status: "Aktif",
    },
    {
        id: 2,
        namaGudang: "Gudang Logistik Bandung",
        alamat: "Jl. Gatot Subroto No. 45, Bandung",
        pic: "Ani Wijaya",
        kontak: "0821-9876-5432",
        status: "Aktif",
    },
    {
        id: 3,
        namaGudang: "Gudang Timur Surabaya",
        alamat: "Jl. Pemuda No. 78, Surabaya",
        pic: "Citra Dewi",
        kontak: "0857-4567-1234",
        status: "Nonaktif",
    },
];

const statusColors = {
    Aktif: "bg-green-100 text-green-800",
    Nonaktif: "bg-gray-100 text-gray-800",
};

const DataGudang = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const filteredData = dummyData.filter((item) =>
        item.namaGudang.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.alamat.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.pic.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const currentData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-9xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <h1 className="text-2xl font-bold text-[#0D47A1] mb-4 md:mb-0 flex items-center gap-2">
                        <Warehouse className="w-6 h-6" />
                        Daftar Gudang
                    </h1>
                    <Header />
                </div>

                {/* Search and Add Button */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
                        <div className="relative w-full sm:w-64">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0D47A1]" />
                            <input
                                type="text"
                                className="w-full pl-10 pr-4 py-2 border border-[#CFD8DC] rounded-lg text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                                placeholder="Cari gudang..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={() => navigate('/form')}
                            className="bg-[#2196F3] hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg shadow-md transition-colors duration-200 flex items-center gap-2 whitespace-nowrap"
                        >
                            <Plus className="w-4 h-4" />
                            Tambah Gudang Baru
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-[#2196F3]">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">No</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Nama Gudang</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Alamat</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">PIC Gudang</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Kontak</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentData.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#0D47A1]">
                                            {(currentPage - 1) * itemsPerPage + index + 1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#0D47A1]">
                                            {item.namaGudang}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#0D47A1]">
                                            {item.alamat}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#0D47A1]">
                                            {item.pic}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#0D47A1]">
                                            {item.kontak}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs rounded-full ${statusColors[item.status]}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-[#0D47A1]">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => navigate(`/gudang/${item.id}`)}
                                                    className="bg-[#2196F3] hover:bg-blue-600 text-white px-3 py-1.5 text-xs rounded-lg transition-colors duration-200 flex items-center gap-1"
                                                >
                                                    <Warehouse className="w-3 h-3" />
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
                        <div className="px-6 py-3 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50">
                            <p className="text-sm text-[#0D47A1]">
                                Menampilkan {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredData.length)} dari {filteredData.length} data
                            </p>
                            <div className="flex gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`w-8 h-8 rounded flex items-center justify-center text-sm ${currentPage === page ? "bg-[#2196F3] text-white" : "text-[#0D47A1] hover:bg-gray-100"} transition-colors duration-200`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DataGudang;