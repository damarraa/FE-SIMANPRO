import React, { useState } from "react";
import { Search, Plus } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import Header from "@/Components/Header/Header";

const dummyData = [
    {
        id: 1,
        namaProyek: "Pemasangan PJU Solar Cell",
        nomorKontrak: "#123456789",
        tanggal: "March 25, 2021",
        manager: "Mana William",
        lokasi: "Jakarta",
        pemberiPekerjaan: "PLN",
        status: "Selesai",
    },
    {
        id: 2,
        namaProyek: "Proyek 2",
        nomorKontrak: "#123456789",
        tanggal: "March 25, 2021",
        manager: "Danny Ahmad",
        lokasi: "Jakarta",
        pemberiPekerjaan: "PT A",
        status: "Berjalan",
    },
];

const statusColors = {
    Selesai: "bg-green-100 text-green-800",
    Berjalan: "bg-yellow-100 text-yellow-800",
};

const DataProyek = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const filteredData = dummyData.filter((item) =>
        item.namaProyek.toLowerCase().includes(searchTerm.toLowerCase())
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
                    <h1 className="text-2xl font-bold text-[#0D47A1] mb-4 md:mb-0">Daftar Proyek</h1>
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
                                placeholder="Cari proyek..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={() => navigate('/proyek/tambah')}
                            className="bg-[#2196F3] hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg shadow-md transition-colors duration-200 flex items-center gap-2 whitespace-nowrap"
                        >
                            <Plus className="w-4 h-4" />
                            Tambah Proyek Baru
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-[#2196F3]">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-10">
                                        <input
                                            type="checkbox"
                                            className="rounded text-white focus:ring-white border-white"
                                        />
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Nama Proyek</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Nomor Kontrak</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Tanggal</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Project Manager</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Lokasi</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Pemberi Pekerjaan</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentData.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="checkbox"
                                                className="rounded text-[#2196F3] focus:ring-[#2196F3] border-[#CFD8DC]"
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#0D47A1]">
                                            {item.namaProyek}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2196F3] font-medium">
                                            {item.nomorKontrak}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#0D47A1]">
                                            {item.tanggal}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#0D47A1]">
                                            {item.manager}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#0D47A1]">
                                            {item.lokasi}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#0D47A1]">
                                            {item.pemberiPekerjaan}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs rounded-full ${statusColors[item.status]}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-[#0D47A1]">
                                            <div className="flex justify-end gap-2">
                                                <button 
                                                    onClick={() => navigate('/detailproyek')} 
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
                </div>
            </div>
        </div>
    );
};

export default DataProyek;