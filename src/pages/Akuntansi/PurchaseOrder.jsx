import React, { useState } from 'react';
import { Printer, Download, Search, Plus, FileText, Check, X, ArrowUp, ArrowDown, Users } from 'lucide-react';
import Header from "@/Components/Header/Header";

const POPage = () => {
  // State for PO data
  const [poList, setPoList] = useState([
    { 
      id: 1, 
      poNumber: 'PO-2023-001', 
      date: '2023-10-15', 
      vendor: 'PT Supplier Jaya', 
      items: 5, 
      total: 12500000, 
      status: 'Draft',
      deliveryDate: '2023-10-25'
    },
    { 
      id: 2, 
      poNumber: 'PO-2023-045', 
      date: '2023-10-20', 
      vendor: 'CV Material Utama', 
      items: 3, 
      total: 8750000, 
      status: 'Approved',
      deliveryDate: '2023-10-30'
    },
    { 
      id: 3, 
      poNumber: 'PO-2023-012', 
      date: '2023-09-05', 
      vendor: 'UD Elektronik Makmur', 
      items: 8, 
      total: 18500000, 
      status: 'Delivered',
      deliveryDate: '2023-09-15'
    },
  ]);

  // State for PO form
  const [poForm, setPoForm] = useState({
    poNumber: '',
    date: '',
    vendor: '',
    deliveryDate: '',
    notes: '',
    items: [
      { id: 1, description: '', quantity: 1, unit: 'pcs', price: 0, total: 0 }
    ],
    status: 'Draft'
  });

  // State for printing
  const [printData, setPrintData] = useState(null);

  const handlePoFormChange = (e) => {
    const { name, value } = e.target;
    setPoForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...poForm.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    // Calculate total if price or quantity changes
    if (field === 'price' || field === 'quantity') {
      updatedItems[index].total = updatedItems[index].quantity * updatedItems[index].price;
    }
    
    setPoForm(prev => ({
      ...prev,
      items: updatedItems
    }));
  };

  const addItem = () => {
    setPoForm(prev => ({
      ...prev,
      items: [...prev.items, { 
        id: prev.items.length + 1, 
        description: '', 
        quantity: 1, 
        unit: 'pcs', 
        price: 0, 
        total: 0 
      }]
    }));
  };

  const removeItem = (index) => {
    const updatedItems = [...poForm.items];
    updatedItems.splice(index, 1);
    setPoForm(prev => ({
      ...prev,
      items: updatedItems
    }));
  };

  const generatePONumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const randomNum = Math.floor(100 + Math.random() * 900);
    return `PO-${year}${month}${day}-${randomNum}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPO = {
      ...poForm,
      poNumber: generatePONumber(),
      total: poForm.items.reduce((sum, item) => sum + item.total, 0)
    };
    
    setPoList([...poList, newPO]);
    setPrintData(newPO);
    
    // Reset form
    setPoForm({
      poNumber: '',
      date: '',
      vendor: '',
      deliveryDate: '',
      notes: '',
      items: [
        { id: 1, description: '', quantity: 1, unit: 'pcs', price: 0, total: 0 }
      ],
      status: 'Draft'
    });
  };

  const handlePrintPO = () => {
    alert(`Mencetak PO: ${printData.poNumber}`);
  };

  const calculateTotal = () => {
    return poForm.items.reduce((sum, item) => sum + item.total, 0);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="max-w-9xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-2xl font-bold text-[#0D47A1] mb-4 md:mb-0">Purchase Order (PO)</h1>
          <Header />
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-[#0D47A1]">Total PO Bulan Ini</p>
                <p className="text-2xl font-bold text-[#0D47A1] mt-1">Rp 39.750.000</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <FileText className="w-6 h-6 text-[#2196F3]" />
              </div>
            </div>
            <p className="text-xs text-[#0D47A1] mt-3">+15% dari bulan lalu</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-[#0D47A1]">PO Pending</p>
                <p className="text-2xl font-bold text-[#0D47A1] mt-1">1</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <ArrowUp className="w-6 h-6 text-[#FFC107]" />
              </div>
            </div>
            <p className="text-xs text-[#0D47A1] mt-3">2 lebih cepat dari bulan lalu</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-[#0D47A1]">Vendor Aktif</p>
                <p className="text-2xl font-bold text-[#0D47A1] mt-1">8</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Users className="w-6 h-6 text-[#4CAF50]" />
              </div>
            </div>
            <p className="text-xs text-[#0D47A1] mt-3">+2 dari bulan lalu</p>
          </div>
        </div>

        {/* PO List Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="bg-[#2196F3] rounded-t-xl p-5">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Daftar Purchase Order
            </h2>
          </div>
          <div className="p-4 sm:p-6">
            <div className="mb-4 flex justify-between items-center">
              <div className="relative w-full max-w-xs">
                <Search className="w-4 h-4 text-[#0D47A1] absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Cari PO..." 
                  className="w-full pl-10 pr-4 py-2 border border-[#CFD8DC] rounded-lg text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                />
              </div>
              <button 
                className="ml-4 px-4 py-2 bg-[#2196F3] text-white rounded-lg flex items-center gap-2 hover:bg-blue-600"
                onClick={() => setPoForm({
                  ...poForm,
                  poNumber: generatePONumber(),
                  date: new Date().toISOString().split('T')[0]
                })}
              >
                <Plus className="w-4 h-4" />
                Buat PO Baru
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#0D47A1] uppercase tracking-wider">No. PO</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#0D47A1] uppercase tracking-wider">Tanggal</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#0D47A1] uppercase tracking-wider">Vendor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#0D47A1] uppercase tracking-wider">Jumlah Item</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#0D47A1] uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#0D47A1] uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#0D47A1] uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {poList.map((po) => (
                    <tr key={po.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#0D47A1]">{po.poNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#0D47A1]">{po.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#0D47A1]">{po.vendor}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#0D47A1]">{po.items}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#0D47A1]">Rp {po.total.toLocaleString('id-ID')}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          po.status === 'Draft' ? 'bg-gray-100 text-gray-800' :
                          po.status === 'Approved' ? 'bg-blue-100 text-blue-800' :
                          po.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {po.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#0D47A1]">
                        <button 
                          className="text-[#2196F3] hover:text-blue-600 mr-3"
                          onClick={() => setPrintData(po)}
                        >
                          Cetak
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

        {/* PO Form */}
        {poForm.poNumber && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
            <div className="bg-[#2196F3] rounded-t-xl p-5">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Form Purchase Order Baru
              </h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-[#0D47A1] mb-1">No. PO</label>
                    <input
                      type="text"
                      name="poNumber"
                      value={poForm.poNumber}
                      onChange={handlePoFormChange}
                      className="w-full px-4 py-2 border border-[#CFD8DC] rounded-lg text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                      required
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#0D47A1] mb-1">Tanggal PO</label>
                    <input
                      type="date"
                      name="date"
                      value={poForm.date}
                      onChange={handlePoFormChange}
                      className="w-full px-4 py-2 border border-[#CFD8DC] rounded-lg text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#0D47A1] mb-1">Vendor</label>
                    <input
                      type="text"
                      name="vendor"
                      value={poForm.vendor}
                      onChange={handlePoFormChange}
                      className="w-full px-4 py-2 border border-[#CFD8DC] rounded-lg text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                      required
                      placeholder="Nama vendor"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#0D47A1] mb-1">Tanggal Pengiriman</label>
                    <input
                      type="date"
                      name="deliveryDate"
                      value={poForm.deliveryDate}
                      onChange={handlePoFormChange}
                      className="w-full px-4 py-2 border border-[#CFD8DC] rounded-lg text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                      required
                    />
                  </div>
                </div>

                {/* Items Table */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-[#0D47A1] mb-3">Daftar Item</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-[#0D47A1] uppercase tracking-wider">Deskripsi</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-[#0D47A1] uppercase tracking-wider">Qty</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-[#0D47A1] uppercase tracking-wider">Unit</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-[#0D47A1] uppercase tracking-wider">Harga</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-[#0D47A1] uppercase tracking-wider">Total</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-[#0D47A1] uppercase tracking-wider"></th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {poForm.items.map((item, index) => (
                          <tr key={item.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="text"
                                value={item.description}
                                onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                className="w-full px-3 py-2 border border-[#CFD8DC] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                                placeholder="Deskripsi item"
                                required
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                                className="w-full px-3 py-2 border border-[#CFD8DC] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                                min="1"
                                required
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <select
                                value={item.unit}
                                onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                                className="w-full px-3 py-2 border border-[#CFD8DC] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                              >
                                <option value="pcs">pcs</option>
                                <option value="unit">unit</option>
                                <option value="kg">kg</option>
                                <option value="liter">liter</option>
                                <option value="meter">meter</option>
                                <option value="set">set</option>
                              </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="number"
                                value={item.price}
                                onChange={(e) => handleItemChange(index, 'price', parseInt(e.target.value) || 0)}
                                className="w-full px-3 py-2 border border-[#CFD8DC] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                                min="0"
                                required
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[#0D47A1]">
                              Rp {item.total.toLocaleString('id-ID')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              {poForm.items.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeItem(index)}
                                  className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <button
                    type="button"
                    onClick={addItem}
                    className="mt-3 px-4 py-2 border border-[#CFD8DC] rounded-lg text-[#0D47A1] bg-white hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Item
                  </button>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-[#0D47A1] mb-1">Catatan</label>
                  <textarea
                    name="notes"
                    value={poForm.notes}
                    onChange={handlePoFormChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-[#CFD8DC] rounded-lg text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                    placeholder="Catatan tambahan untuk PO ini"
                  ></textarea>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-[#0D47A1]">Total PO:</p>
                    <p className="text-xl font-bold text-[#0D47A1]">Rp {calculateTotal().toLocaleString('id-ID')}</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setPoForm({
                        poNumber: '',
                        date: '',
                        vendor: '',
                        deliveryDate: '',
                        notes: '',
                        items: [
                          { id: 1, description: '', quantity: 1, unit: 'pcs', price: 0, total: 0 }
                        ],
                        status: 'Draft'
                      })}
                      className="px-4 py-2 border border-[#CFD8DC] rounded-lg text-[#0D47A1] bg-white hover:bg-gray-50"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#2196F3] text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Simpan PO
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* PO Print Preview */}
        {printData && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8 p-6 max-w-2xl mx-auto">
            <div className="border-2 border-gray-200 p-6" id="po-to-print">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-xl font-bold text-[#0D47A1]">PURCHASE ORDER</h2>
                  <p className="text-sm text-[#0D47A1]">No: {printData.poNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[#0D47A1]">Tanggal: {printData.date}</p>
                  <p className="text-sm text-[#0D47A1]">Pengiriman: {printData.deliveryDate}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-[#0D47A1]">Kepada:</p>
                    <p className="text-[#0D47A1]">{printData.vendor}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#0D47A1]">Dari:</p>
                    <p className="text-[#0D47A1]">PT Perusahaan Anda</p>
                    <p className="text-[#0D47A1]">Jl. Contoh No. 123</p>
                    <p className="text-[#0D47A1]">Jakarta, Indonesia</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <table className="min-w-full border border-[#CFD8DC]">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left text-xs font-medium text-[#0D47A1] uppercase border-b border-[#CFD8DC]">No</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[#0D47A1] uppercase border-b border-[#CFD8DC]">Deskripsi</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[#0D47A1] uppercase border-b border-[#CFD8DC]">Qty</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[#0D47A1] uppercase border-b border-[#CFD8DC]">Unit</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[#0D47A1] uppercase border-b border-[#CFD8DC]">Harga</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[#0D47A1] uppercase border-b border-[#CFD8DC]">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {printData.items.map((item, index) => (
                      <tr key={index} className="border-b border-[#CFD8DC]">
                        <td className="px-4 py-2 text-sm text-[#0D47A1]">{index + 1}</td>
                        <td className="px-4 py-2 text-sm text-[#0D47A1]">{item.description}</td>
                        <td className="px-4 py-2 text-sm text-[#0D47A1]">{item.quantity}</td>
                        <td className="px-4 py-2 text-sm text-[#0D47A1]">{item.unit}</td>
                        <td className="px-4 py-2 text-sm text-[#0D47A1]">Rp {item.price.toLocaleString('id-ID')}</td>
                        <td className="px-4 py-2 text-sm text-[#0D47A1]">Rp {item.total.toLocaleString('id-ID')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex justify-end mb-6">
                <div className="w-64">
                  <div className="flex justify-between py-2 border-b border-[#CFD8DC]">
                    <span className="text-sm font-medium text-[#0D47A1]">Subtotal</span>
                    <span className="text-sm text-[#0D47A1]">Rp {printData.total.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#CFD8DC]">
                    <span className="text-sm font-medium text-[#0D47A1]">PPN (10%)</span>
                    <span className="text-sm text-[#0D47A1]">Rp {(printData.total * 0.1).toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-sm font-bold text-[#0D47A1]">Total</span>
                    <span className="text-sm font-bold text-[#0D47A1]">Rp {(printData.total * 1.1).toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>
              
              {printData.notes && (
                <div className="mb-6">
                  <p className="text-sm font-medium text-[#0D47A1] mb-1">Catatan:</p>
                  <p className="text-sm text-[#0D47A1]">{printData.notes}</p>
                </div>
              )}
              
              <div className="mt-10 flex justify-between">
                <div className="text-center">
                  <p className="border-t-2 border-gray-400 pt-2 w-32 mx-auto">Vendor</p>
                </div>
                <div className="text-center">
                  <p className="border-t-2 border-gray-400 pt-2 w-32 mx-auto">Hormat Kami</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={handlePrintPO}
                className="px-4 py-2 bg-[#2196F3] text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Cetak PO
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

export default POPage;