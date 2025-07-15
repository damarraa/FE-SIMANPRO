import React, { useState } from 'react';
import { Printer, FileText, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FormKwitansi = () => {
  const navigate = useNavigate();
  const [receiptForm, setReceiptForm] = useState({
    receiptNo: '',
    invoiceNo: 'INV-CLIENT-2023-101',
    clientName: 'PT Pelanggan Pertama',
    paymentDate: '',
    paymentMethod: 'Transfer Bank',
    amount: '25000000',
    description: '',
  });

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
  };

  const handlePrintReceipt = () => {
    alert(`Mencetak kwitansi: ${printData.receiptNo}`);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Form Kwitansi Pembayaran
          </h1>
        </div>

        {!printData ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="p-6">
              <form onSubmit={handleReceiptSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">No. Invoice</label>
                    <input
                      type="text"
                      name="invoiceNo"
                      value={receiptForm.invoiceNo}
                      onChange={handleReceiptChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Klien</label>
                    <input
                      type="text"
                      name="clientName"
                      value={receiptForm.clientName}
                      onChange={handleReceiptChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Pembayaran</label>
                    <input
                      type="date"
                      name="paymentDate"
                      value={receiptForm.paymentDate}
                      onChange={handleReceiptChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Metode Pembayaran</label>
                    <select
                      name="paymentMethod"
                      value={receiptForm.paymentMethod}
                      onChange={handleReceiptChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="Transfer Bank">Transfer Bank</option>
                      <option value="Tunai">Tunai</option>
                      <option value="Kartu Kredit">Kartu Kredit</option>
                      <option value="E-Wallet">E-Wallet</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Pembayaran</label>
                    <input
                      type="number"
                      name="amount"
                      value={receiptForm.amount}
                      onChange={handleReceiptChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
                    <textarea
                      name="description"
                      value={receiptForm.description}
                      onChange={handleReceiptChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Printer className="w-4 h-4" />
                    Buat & Cetak Kwitansi
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="border-2 border-gray-200 p-6" id="receipt-to-print">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">KWITANSI PEMBAYARAN</h2>
                <p className="text-sm text-gray-600">No: {printData.receiptNo}</p>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Telah diterima dari:</span>
                  <span className="font-medium">{printData.clientName}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Untuk pembayaran:</span>
                  <span className="font-medium">Invoice {printData.invoiceNo}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Jumlah:</span>
                  <span className="font-medium">Rp {Number(printData.amount).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Metode Pembayaran:</span>
                  <span className="font-medium">{printData.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tanggal:</span>
                  <span className="font-medium">{printData.paymentDate}</span>
                </div>
              </div>
              
              {printData.description && (
                <div className="mb-6">
                  <p className="text-gray-600 mb-1">Keterangan:</p>
                  <p className="text-gray-800">{printData.description}</p>
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
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Cetak Kwitansi
              </button>
              <button
                onClick={() => setPrintData(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Kembali ke Form
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormKwitansi;