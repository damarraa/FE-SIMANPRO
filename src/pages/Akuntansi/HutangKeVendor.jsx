import React, { useState } from 'react';
import { Search, Download, Plus, Users, ArrowDown } from 'lucide-react';

const HutangVendor = () => {
  const [vendorDebts, setVendorDebts] = useState([
    { id: 1, vendorName: 'PT Supplier Jaya', invoiceNo: 'INV-2023-001', date: '2023-10-15', dueDate: '2023-11-15', amount: 12500000, status: 'Belum Lunas' },
    { id: 2, vendorName: 'CV Material Utama', invoiceNo: 'INV-2023-045', date: '2023-10-20', dueDate: '2023-11-20', amount: 8750000, status: 'Belum Lunas' },
    { id: 3, vendorName: 'UD Elektronik Makmur', invoiceNo: 'INV-2023-012', date: '2023-09-05', dueDate: '2023-10-05', amount: 18500000, status: 'Lunas' },
  ]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#2196F3]" />
            Hutang ke Vendor
          </h1>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 flex items-center gap-2 hover:bg-gray-50">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="px-4 py-2 bg-[#2196F3] text-white rounded-lg flex items-center gap-2 hover:bg-blue-700">
              <Plus className="w-4 h-4" />
              Tambah Hutang
            </button>
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Total Hutang</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">Rp 21.250.000</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <ArrowDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">-1.2% dari bulan lalu</p>
        </div>

        {/* Vendor Debts Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Daftar Hutang Vendor</h2>
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Cari vendor..." 
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#2196F3]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Vendor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">No. Invoice</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Tanggal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Jatuh Tempo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Jumlah</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vendorDebts.map((debt) => (
                  <tr key={debt.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{debt.vendorName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{debt.invoiceNo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{debt.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{debt.dueDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rp {debt.amount.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${debt.status === 'Lunas' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {debt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="text-[#2196F3] hover:text-blue-800 mr-3">Bayar</button>
                      <button className="text-gray-600 hover:text-gray-800">Detail</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 border-t border-gray-100 flex justify-between items-center">
            <p className="text-sm text-gray-500">Menampilkan 1 sampai 3 dari 3 entri</p>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 bg-white">Sebelumnya</button>
              <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 bg-white">Selanjutnya</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HutangVendor;