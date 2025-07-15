import React, { useState } from "react";
import Header from "@/Components/Header/Header";

const DetailProyek = () => {
    const [activeTab, setActiveTab] = useState("pekerjaan");


    const renderTabContent = () => {
        switch(activeTab) {
            case "pekerjaan":
                return (
                    <>
                        <table className="w-full text-sm text-left text-gray-700">
                            <thead className="bg-gray-100 text-gray-700 text-sm font-semibold">
                                <tr>
                                    <th className="px-4 py-2">No</th>
                                    <th className="px-4 py-2">Pekerjaan</th>
                                    <th className="px-4 py-2">Satuan</th>
                                    <th className="px-4 py-2">Volume</th>
                                    <th className="px-4 py-2">Harga Satuan</th>
                                    <th className="px-4 py-2">Jumlah Harga</th>
                                    <th className="px-4 py-2">Kontak</th>
                                    <th className="px-4 py-2">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-4 py-2">1</td>
                                    <td className="px-4 py-2">Penarikan LVTC 3x70 + 1x50 mm2</td>
                                    <td className="px-4 py-2">Buah</td>
                                    <td className="px-4 py-2">138.000</td>
                                    <td className="px-4 py-2">13.200</td>
                                    <td className="px-4 py-2">304.400</td>
                                    <td className="px-4 py-2">2</td>
                                    <td className="px-4 py-2 flex space-x-2">
                                        <button className="bg-blue-500 text-white px-3 py-1 rounded-md text-xs">Edit</button>
                                        <button className="bg-red-500 text-white px-3 py-1 rounded-md text-xs">Delete</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="flex justify-end items-center mt-4 space-x-2 text-sm">
                            <button
                                className="w-8 h-8 border rounded-full bg-blue-500 text-white"
                                onClick={() => setCurrentPage(1)}
                            >
                                1
                            </button>
                            <button
                                className="w-8 h-8 border rounded-full text-blue-500"
                                onClick={() => setCurrentPage(2)}
                            >
                                2
                            </button>
                            <button
                                className="w-8 h-8 border rounded-full text-blue-500"
                                onClick={() => setCurrentPage(3)}
                            >
                                3
                            </button>
                            <button
                                className="w-8 h-8 border rounded-full text-blue-500"
                                onClick={() => setCurrentPage(prev => prev + 1)}
                            >
                                &gt;
                            </button>
                        </div>
                    </>
                );
            case "tim":
                return (
                   
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
                        
                        {/* Card Tim */}
                        <div className="bg-white shadow rounded-xl p-4 text-center">
                            <div className="w-16 h-16 bg-blue-200 rounded-full mx-auto mb-3"></div>
                            <h4 className="font-semibold text-gray-800">Dimitres Viga</h4>
                            <p className="text-sm text-gray-500 mb-4">Project Manager</p>
                            <div className="flex justify-center space-x-4 text-blue-600">
                                <button title="Telepon">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h2.28a1 1 0 01.95.684l1.356 4.07a1 1 0 01-.21.987L8.414 10.414a16.018 16.018 0 006.172 6.172l1.673-1.673a1 1 0 01.987-.21l4.07 1.356a1 1 0 01.684.95V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </button>
                                <button title="Email">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12H8m0 0l4 4m-4-4l4-4m8-4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2z" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Ulangi Card ini untuk setiap anggota */}
                        <div className="bg-white shadow rounded-xl p-4 text-center">
                            <div className="w-16 h-16 bg-blue-200 rounded-full mx-auto mb-3"></div>
                            <h4 className="font-semibold text-gray-800">Tom Housenburg</h4>
                            <p className="text-sm text-gray-500 mb-4">Supervisor</p>
                            <div className="flex justify-center space-x-4 text-blue-600">
                                <button title="Telepon">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h2.28a1 1 0 01.95.684l1.356 4.07a1 1 0 01-.21.987L8.414 10.414a16.018 16.018 0 006.172 6.172l1.673-1.673a1 1 0 01.987-.21l4.07 1.356a1 1 0 01.684.95V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </button>
                                <button title="Email">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12H8m0 0l4 4m-4-4l4-4m8-4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2z" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Tambahkan lebih banyak anggota di bawah ini */}
                        <div className="bg-white shadow rounded-xl p-4 text-center">
                            <div className="w-16 h-16 bg-blue-200 rounded-full mx-auto mb-3"></div>
                            <h4 className="font-semibold text-gray-800">Dana Benevista</h4>
                            <p className="text-sm text-gray-500 mb-4">Petugas</p>
                            <div className="flex justify-center space-x-4 text-blue-600">
                                <button title="Telepon">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h2.28a1 1 0 01.95.684l1.356 4.07a1 1 0 01-.21.987L8.414 10.414a16.018 16.018 0 006.172 6.172l1.673-1.673a1 1 0 01.987-.21l4.07 1.356a1 1 0 01.684.95V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </button>
                                <button title="Email">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12H8m0 0l4 4m-4-4l4-4m8-4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2z" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="bg-white shadow rounded-xl p-4 text-center">
                            <div className="w-16 h-16 bg-blue-200 rounded-full mx-auto mb-3"></div>
                            <h4 className="font-semibold text-gray-800">Salvadore Morbeau</h4>
                            <p className="text-sm text-gray-500 mb-4">Petugas</p>
                            <div className="flex justify-center space-x-4 text-blue-600">
                                <button title="Telepon">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h2.28a1 1 0 01.95.684l1.356 4.07a1 1 0 01-.21.987L8.414 10.414a16.018 16.018 0 006.172 6.172l1.673-1.673a1 1 0 01.987-.21l4.07 1.356a1 1 0 01.684.95V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </button>
                                <button title="Email">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12H8m0 0l4 4m-4-4l4-4m8-4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                );
            case "riwayat":
                return (
                    <div className="p-4">
                        <h2 className="font-semibold text-lg text-blue-800 mb-4">Riwayat Aktivitas</h2>

                        <div className="overflow-x-auto rounded-lg shadow bg-white">
                            <table className="min-w-full text-sm text-left text-gray-700">
                                <thead className="bg-blue-50 text-blue-800">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">No</th>
                                        <th className="px-4 py-3 font-medium">Tanggal</th>
                                        <th className="px-4 py-3 font-medium">Pekerjaan</th>
                                        <th className="px-4 py-3 font-medium">Satuan</th>
                                        <th className="px-4 py-3 font-medium">Volume</th>
                                        <th className="px-4 py-3 font-medium">Harga Satuan</th>
                                        <th className="px-4 py-3 font-medium">Jumlah Harga</th>
                                        <th className="px-4 py-3 font-medium text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b hover:bg-gray-50">
                                        <td className="px-4 py-2">1</td>
                                        <td className="px-4 py-2 text-blue-700">02/06/2025</td>
                                        <td className="px-4 py-2">Penarikan LVTC 3x70 + 1x50 mm2</td>
                                        <td className="px-4 py-2">Buah</td>
                                        <td className="px-4 py-2">2</td>
                                        <td className="px-4 py-2">13.200</td>
                                        <td className="px-4 py-2">26.400</td>
                                        <td className="px-4 py-2 text-center space-x-2">
                                            <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">Edit</button>
                                            <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">Delete</button>
                                        </td>
                                    </tr>
                                    <tr className="border-b hover:bg-gray-50">
                                        <td className="px-4 py-2">2</td>
                                        <td className="px-4 py-2 text-blue-700">02/05/2025</td>
                                        <td className="px-4 py-2">Menggali lobang tiang</td>
                                        <td className="px-4 py-2">Lobang</td>
                                        <td className="px-4 py-2">5</td>
                                        <td className="px-4 py-2">-</td>
                                        <td className="px-4 py-2">-</td>
                                        <td className="px-4 py-2 text-center space-x-2">
                                            <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">Edit</button>
                                            <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">Delete</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <div className="flex items-center justify-between p-4">
                                <p className="text-sm text-gray-600">Showing 1–5 from 100 data</p>
                                <div className="flex items-center space-x-2">
                                    <button className="px-2 py-1 rounded-full text-gray-500 hover:text-blue-600">&lt;</button>
                                    <button className="px-3 py-1 rounded-full bg-blue-500 text-white font-medium">1</button>
                                    <button className="px-3 py-1 rounded-full text-blue-500 hover:bg-blue-100">2</button>
                                    <button className="px-3 py-1 rounded-full text-blue-500 hover:bg-blue-100">3</button>
                                    <button className="px-2 py-1 rounded-full text-gray-500 hover:text-blue-600">&gt;</button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="p-6 w-full">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 flex-wrap">
                           <h2 className="text-2xl font-bold text-[#0D47A1]">Detail Proyek</h2>
                           <div className="w-full md:w-auto">
                               <Header />
                           </div>
           
                       </div>

            {/* Box Header */}
            <div className="bg-white shadow rounded-xl p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-blue-700">Pemasangan PJU Solar Cell</h3>
                        <p className="text-sm text-gray-500">KD-PAL-PKU-001</p>
                    </div>
                    <button className="bg-yellow-400 text-white font-semibold px-4 py-2 rounded-xl shadow">Dalam Proses</button>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '74%' }}></div>
                </div>
                <p className="text-sm text-right text-gray-500">74% Selesai</p>

                {/* Informasi Proyek */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                    <div>
                        <label className="text-sm font-medium text-gray-700">Lokasi Proyek</label>
                        <input type="text" value="Pekanbaru Kota" className="w-full mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg" readOnly />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Tanggal Mulai</label>
                        <input type="text" value="05 Maret 2023" className="w-full mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg" readOnly />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Target Selesai</label>
                        <input type="text" value="05 Maret 2023" className="w-full mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg" readOnly />
                    </div>
                </div>

                <div className="mt-6">
                    <p className="text-sm text-gray-700 font-medium">Anggaran Proyek</p>
                    <p className="text-lg font-bold text-blue-600">Rp. 250.000.000</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: '74%' }}></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Terkeluarakan: Rp 185.000.000</p>
                </div>
            </div>

            {/* Box Informasi */}
            <div className="grid grid-cols-5 gap-4 mb-6">
                <div className="bg-white shadow rounded-xl p-4 text-center">
                    <div className="w-12 h-12 bg-blue-200 mx-auto rounded-full mb-2"></div>
                    <p className="text-sm text-gray-500">Cuaca</p>
                    <p className="font-semibold text-gray-700">Berawan</p>
                </div>
                <div className="bg-white shadow rounded-xl p-4 text-center">
                    <div className="w-12 h-12 bg-blue-200 mx-auto rounded-full mb-2"></div>
                    <p className="text-sm text-gray-500">Jumlah Petugas</p>
                    <p className="font-semibold text-gray-700">23</p>
                </div>
                <div className="bg-white shadow rounded-xl p-4 text-center">
                    <div className="w-12 h-12 bg-blue-200 mx-auto rounded-full mb-2"></div>
                    <p className="text-sm text-gray-500">Jam Mulai</p>
                    <p className="font-semibold text-gray-700">08:00 WIB</p>
                </div>
                <div className="bg-white shadow rounded-xl p-4 text-center">
                    <div className="w-12 h-12 bg-blue-200 mx-auto rounded-full mb-2"></div>
                    <p className="text-sm text-gray-500">Jam Selesai</p>
                    <p className="font-semibold text-gray-700">18:00 WIB</p>
                </div>
                <div className="bg-white shadow rounded-xl p-4 text-center">
                    <div className="w-12 h-12 bg-blue-200 mx-auto rounded-full mb-2"></div>
                    <p className="text-sm text-gray-500">Titik Koordinat</p>
                    <p className="font-semibold text-gray-700">0.1234, 101.1234</p>
                </div>
            </div>

            {/* Daftar Pekerjaan */}
            <div className="bg-white shadow rounded-xl p-6">
                <div className="border-b border-gray-200 mb-4">
                    <nav className="flex space-x-6">
                        <button 
                            onClick={() => setActiveTab("pekerjaan")}
                            className={`pb-2 ${activeTab === "pekerjaan" ? "text-blue-600 font-semibold border-b-2 border-blue-600" : "text-gray-500 hover:text-blue-600"}`}
                        >
                            Pekerjaan
                        </button>
                        <button 
                            onClick={() => setActiveTab("tim")}
                            className={`pb-2 ${activeTab === "tim" ? "text-blue-600 font-semibold border-b-2 border-blue-600" : "text-gray-500 hover:text-blue-600"}`}
                        >
                            Tim Proyek
                        </button>
                        <button 
                            onClick={() => setActiveTab("riwayat")}
                            className={`pb-2 ${activeTab === "riwayat" ? "text-blue-600 font-semibold border-b-2 border-blue-600" : "text-gray-500 hover:text-blue-600"}`}
                        >
                            Riwayat Aktivitas
                        </button>
                        <button 
                            onClick={() => setActiveTab("dokumentasi")}
                            className={`pb-2 ${activeTab === "dokumentasi" ? "text-blue-600 font-semibold border-b-2 border-blue-600" : "text-gray-500 hover:text-blue-600"}`}
                        >
                            Dokumentasi
                        </button>
                        <button 
                            onClick={() => setActiveTab("kontrak")}
                            className={`pb-2 ${activeTab === "kontrak" ? "text-blue-600 font-semibold border-b-2 border-blue-600" : "text-gray-500 hover:text-blue-600"}`}
                        >
                            Dokumen Kontrak
                        </button>
                    </nav>
                </div>

                {renderTabContent()}
            </div>
        </div>
    );
};

export default DetailProyek;