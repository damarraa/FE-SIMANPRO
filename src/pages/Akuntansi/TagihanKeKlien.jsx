import React, { useState } from 'react';
import { Search, Download, Plus, FileText, ArrowUp } from 'lucide-react';

const TagihanKlien = () => {
  const [clientInvoices, setClientInvoices] = useState([
    { id: 1, clientName: 'PT Pelanggan Pertama', invoiceNo: 'INV-CLIENT-2023-101', date: '2023-10-10', dueDate: '2023-11-10', amount: 25000000, status: 'Belum Dibayar' },
    { id: 2, clientName: 'CV Mitra Bisnis', invoiceNo: 'INV-CLIENT-2023-102', date: '2023-10-12', dueDate: '2023-11-12', amount: 15000000, status: 'Dibayar' },
    { id: 3, clientName: 'UD Toko Maju', invoiceNo: 'INV-CLIENT-2023-103', date: '2023-10-18', dueDate: '2023-11-18', amount: 7500000, status: 'Belum Dibayar' },
  ]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#2196F3]" />
            Tagihan ke Klien
          </h1>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 flex items-center gap-2 hover:bg-gray-50">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="px-4 py-2 bg-[#2196F3] text-white rounded-lg flex items-center gap-2 hover:bg-blue-700">
              <Plus className="w-4 h-4" />
              Buat Invoice
            </button>
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Total Piutang</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">Rp 32.500.000</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <ArrowUp className="w-6 h-6 text-[#2196F3]" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">+2.5% dari bulan lalu</p>
        </div>

        {/* Client Invoices Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Daftar Tagihan Klien</h2>
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Cari klien..." 
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#2196F3]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Klien</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">No. Invoice</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Tanggal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Jatuh Tempo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Jumlah</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clientInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{invoice.clientName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.invoiceNo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.dueDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rp {invoice.amount.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${invoice.status === 'Dibayar' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="text-[#2196F3] hover:text-blue-800 mr-3">Kwitansi</button>
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

export default TagihanKlien;