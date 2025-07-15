import React, { useState } from 'react';
import { Printer, Download, Search, Plus, FileText, DollarSign, Users, ArrowUp, ArrowDown, X, Check } from 'lucide-react';
import Header from "@/Components/Header/Header";

const AccountingReport = () => {
  // State for vendor debts
  const [vendorDebts, setVendorDebts] = useState([
    { id: 1, vendorName: 'PT Supplier Jaya', invoiceNo: 'INV-2023-001', date: '2023-10-15', dueDate: '2023-11-15', amount: 12500000, status: 'Belum Lunas' },
    { id: 2, vendorName: 'CV Material Utama', invoiceNo: 'INV-2023-045', date: '2023-10-20', dueDate: '2023-11-20', amount: 8750000, status: 'Belum Lunas' },
    { id: 3, vendorName: 'UD Elektronik Makmur', invoiceNo: 'INV-2023-012', date: '2023-09-05', dueDate: '2023-10-05', amount: 18500000, status: 'Lunas' },
  ]);

  // State for client invoices
  const [clientInvoices, setClientInvoices] = useState([
    { id: 1, clientName: 'PT Pelanggan Pertama', invoiceNo: 'INV-CLIENT-2023-101', date: '2023-10-10', dueDate: '2023-11-10', amount: 25000000, status: 'Belum Dibayar' },
    { id: 2, clientName: 'CV Mitra Bisnis', invoiceNo: 'INV-CLIENT-2023-102', date: '2023-10-12', dueDate: '2023-11-12', amount: 15000000, status: 'Dibayar' },
    { id: 3, clientName: 'UD Toko Maju', invoiceNo: 'INV-CLIENT-2023-103', date: '2023-10-18', dueDate: '2023-11-18', amount: 7500000, status: 'Belum Dibayar' },
  ]);

  // State for receipt form
  const [receiptForm, setReceiptForm] = useState({
    receiptNo: '',
    invoiceNo: '',
    clientName: '',
    paymentDate: '',
    paymentMethod: 'Transfer Bank',
    amount: '',
    description: '',
  });

  // State for printing
  const [printData, setPrintData] = useState(null);

  const handleReceiptChange = (e) => {
    const { name, value } = e.target;
    setReceiptForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateReceiptNo = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `RCPT-${year}${month}${day}-${randomNum}`;
  };

  const handleReceiptSubmit = (e) => {
    e.preventDefault();
    const newReceipt = {
      ...receiptForm,
      receiptNo: generateReceiptNo(),
    };
    setPrintData(newReceipt);
    
    setClientInvoices(prev => 
      prev.map(inv => 
        inv.invoiceNo === receiptForm.invoiceNo ? {...inv, status: 'Dibayar'} : inv
      )
    );
    
    setReceiptForm({
      receiptNo: '',
      invoiceNo: '',
      clientName: '',
      paymentDate: '',
      paymentMethod: 'Transfer Bank',
      amount: '',
      description: '',
    });
  };

  const handlePrintReceipt = () => {
    alert(`Mencetak kwitansi: ${printData.receiptNo}`);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="max-w-9xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-2xl font-bold text-[#0D47A1] mb-4 md:mb-0">Laporan Keuangan</h1>
          <Header />
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-[#0D47A1]">Total Piutang</p>
                <p className="text-2xl font-bold text-[#0D47A1] mt-1">Rp 32.500.000</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <ArrowUp className="w-6 h-6 text-[#2196F3]" />
              </div>
            </div>
            <p className="text-xs text-[#0D47A1] mt-3">+2.5% dari bulan lalu</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-[#0D47A1]">Total Hutang</p>
                <p className="text-2xl font-bold text-[#0D47A1] mt-1">Rp 21.250.000</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <ArrowDown className="w-6 h-6 text-[#F44336]" />
              </div>
            </div>
            <p className="text-xs text-[#0D47A1] mt-3">-1.2% dari bulan lalu</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-[#0D47A1]">Saldo Kas</p>
                <p className="text-2xl font-bold text-[#0D47A1] mt-1">Rp 78.340.000</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <DollarSign className="w-6 h-6 text-[#4CAF50]" />
              </div>
            </div>
            <p className="text-xs text-[#0D47A1] mt-3">+5.8% dari bulan lalu</p>
          </div>
        </div>

        {/* Vendor Debts Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="bg-[#2196F3] rounded-t-xl p-5">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Users className="w-5 h-5" />
              Hutang ke Vendor
            </h2>
          </div>
          <div className="p-4 sm:p-6">
            <div className="mb-4 flex justify-between items-center">
              <div className="relative w-full max-w-xs">
                <Search className="w-4 h-4 text-[#0D47A1] absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Cari vendor..." 
                  className="w-full pl-10 pr-4 py-2 border border-[#CFD8DC] rounded-lg text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                />
              </div>
              <button className="ml-4 px-4 py-2 bg-[#2196F3] text-white rounded-lg flex items-center gap-2 hover:bg-blue-600">
                <Plus className="w-4 h-4" />
                Tambah
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#0D47A1] uppercase tracking-wider">Vendor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#0D47A1] uppercase tracking-wider">No. Invoice</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#0D47A1] uppercase tracking-wider">Tanggal</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#0D47A1] uppercase tracking-wider">Jatuh Tempo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#0D47A1] uppercase tracking-wider">Jumlah</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#0D47A1] uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#0D47A1] uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {vendorDebts.map((debt) => (
                    <tr key={debt.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#0D47A1]">{debt.vendorName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#0D47A1]">{debt.invoiceNo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#0D47A1]">{debt.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#0D47A1]">{debt.dueDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#0D47A1]">Rp {debt.amount.toLocaleString('id-ID')}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${debt.status === 'Lunas' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {debt.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#0D47A1]">
                        <button className="text-[#2196F3] hover:text-blue-600 mr-3">Bayar</button>
                        <button className="text-[#0D47A1] hover:text-blue-800">Detail</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="px-6 py-3 border-t border-gray-100 flex justify-between items-center">
              <p className="text-sm text-[#0D47A1]">Menampilkan 1 sampai 3 dari 3 entri</p>
              <div className="flex gap-2">
                <button className="px-3 py-1 border border-[#CFD8DC] rounded text-sm text-[#0D47A1] bg-white hover:bg-gray-50">Sebelumnya</button>
                <button className="px-3 py-1 border border-[#CFD8DC] rounded text-sm text-[#0D47A1] bg-white hover:bg-gray-50">Selanjutnya</button>
              </div>
            </div>
          </div>
        </div>

        {/* Client Invoices Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="bg-[#2196F3] rounded-t-xl p-5">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Tagihan ke Klien
            </h2>
          </div>
          <div className="p-4 sm:p-6">
            <div className="mb-4 flex justify-between items-center">
              <div className="relative w-full max-w-xs">
                <Search className="w-4 h-4 text-[#0D47A1] absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Cari klien..." 
                  className="w-full pl-10 pr-4 py-2 border border-[#CFD8DC] rounded-lg text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                />
              </div>
              <button className="ml-4 px-4 py-2 bg-[#2196F3] text-white rounded-lg flex items-center gap-2 hover:bg-blue-600">
                <Plus className="w-4 h-4" />
                Tambah
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#0D47A1] uppercase tracking-wider">Klien</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#0D47A1] uppercase tracking-wider">No. Invoice</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#0D47A1] uppercase tracking-wider">Tanggal</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#0D47A1] uppercase tracking-wider">Jatuh Tempo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#0D47A1] uppercase tracking-wider">Jumlah</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#0D47A1] uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#0D47A1] uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {clientInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#0D47A1]">{invoice.clientName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#0D47A1]">{invoice.invoiceNo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#0D47A1]">{invoice.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#0D47A1]">{invoice.dueDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#0D47A1]">Rp {invoice.amount.toLocaleString('id-ID')}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${invoice.status === 'Dibayar' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#0D47A1]">
                        <button 
                          className="text-[#2196F3] hover:text-blue-600 mr-3"
                          onClick={() => setReceiptForm({
                            ...receiptForm,
                            invoiceNo: invoice.invoiceNo,
                            clientName: invoice.clientName,
                            amount: invoice.amount
                          })}
                        >
                          Buat Kwitansi
                        </button>
                        <button className="text-[#0D47A1] hover:text-blue-800">Detail</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="px-6 py-3 border-t border-gray-100 flex justify-between items-center">
              <p className="text-sm text-[#0D47A1]">Menampilkan 1 sampai 3 dari 3 entri</p>
              <div className="flex gap-2">
                <button className="px-3 py-1 border border-[#CFD8DC] rounded text-sm text-[#0D47A1] bg-white hover:bg-gray-50">Sebelumnya</button>
                <button className="px-3 py-1 border border-[#CFD8DC] rounded text-sm text-[#0D47A1] bg-white hover:bg-gray-50">Selanjutnya</button>
              </div>
            </div>
          </div>
        </div>

        {/* Receipt Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="bg-[#2196F3] rounded-t-xl p-5">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Form Kwitansi Pembayaran
            </h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleReceiptSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#0D47A1] mb-1">No. Invoice</label>
                  <input
                    type="text"
                    name="invoiceNo"
                    value={receiptForm.invoiceNo}
                    onChange={handleReceiptChange}
                    className="w-full px-4 py-2 border border-[#CFD8DC] rounded-lg text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0D47A1] mb-1">Nama Klien</label>
                  <input
                    type="text"
                    name="clientName"
                    value={receiptForm.clientName}
                    onChange={handleReceiptChange}
                    className="w-full px-4 py-2 border border-[#CFD8DC] rounded-lg text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0D47A1] mb-1">Tanggal Pembayaran</label>
                  <input
                    type="date"
                    name="paymentDate"
                    value={receiptForm.paymentDate}
                    onChange={handleReceiptChange}
                    className="w-full px-4 py-2 border border-[#CFD8DC] rounded-lg text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0D47A1] mb-1">Metode Pembayaran</label>
                  <select
                    name="paymentMethod"
                    value={receiptForm.paymentMethod}
                    onChange={handleReceiptChange}
                    className="w-full px-4 py-2 border border-[#CFD8DC] rounded-lg text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                    required
                  >
                    <option value="Transfer Bank">Transfer Bank</option>
                    <option value="Tunai">Tunai</option>
                    <option value="Kartu Kredit">Kartu Kredit</option>
                    <option value="E-Wallet">E-Wallet</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0D47A1] mb-1">Jumlah Pembayaran</label>
                  <input
                    type="number"
                    name="amount"
                    value={receiptForm.amount}
                    onChange={handleReceiptChange}
                    className="w-full px-4 py-2 border border-[#CFD8DC] rounded-lg text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#0D47A1] mb-1">Keterangan</label>
                  <textarea
                    name="description"
                    value={receiptForm.description}
                    onChange={handleReceiptChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-[#CFD8DC] rounded-lg text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                  ></textarea>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  className="px-4 py-2 border border-[#CFD8DC] rounded-lg text-[#0D47A1] bg-white hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2196F3] text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  Buat & Cetak Kwitansi
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Receipt Print Preview */}
        {printData && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8 p-6 max-w-2xl mx-auto">
            <div className="border-2 border-gray-200 p-6" id="receipt-to-print">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-[#0D47A1]">KWITANSI PEMBAYARAN</h2>
                <p className="text-sm text-[#0D47A1]">No: {printData.receiptNo}</p>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-[#0D47A1]">Telah diterima dari:</span>
                  <span className="font-medium">{printData.clientName}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-[#0D47A1]">Untuk pembayaran:</span>
                  <span className="font-medium">Invoice {printData.invoiceNo}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-[#0D47A1]">Jumlah:</span>
                  <span className="font-medium">Rp {Number(printData.amount).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-[#0D47A1]">Metode Pembayaran:</span>
                  <span className="font-medium">{printData.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#0D47A1]">Tanggal:</span>
                  <span className="font-medium">{printData.paymentDate}</span>
                </div>
              </div>
              
              {printData.description && (
                <div className="mb-6">
                  <p className="text-[#0D47A1] mb-1">Keterangan:</p>
                  <p className="text-[#0D47A1]">{printData.description}</p>
                </div>
              )}
              
              <div className="mt-10 flex justify-between">
                <div className="text-center">
                  <p className="border-t-2 border-gray-400 pt-2 w-32 mx-auto">Penerima</p>
                </div>
                <div className="text-center">
                  <p className="border-t-2 border-gray-400 pt-2 w-32 mx-auto">Hormat Kami</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={handlePrintReceipt}
                className="px-4 py-2 bg-[#2196F3] text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Cetak Kwitansi
              </button>
              <button
                onClick={() => setPrintData(null)}
                className="px-4 py-2 border border-[#CFD8DC] rounded-lg text-[#0D47A1] bg-white hover:bg-gray-50"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountingReport;