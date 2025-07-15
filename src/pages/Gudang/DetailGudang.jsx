import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Warehouse, Box, Package, Plus, Upload, X, Edit } from 'lucide-react';
import Header from "@/Components/Header/Header";

const DetailGudang = () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('material');
    const [showAddForm, setShowAddForm] = useState(false);
    const [showCSVUpload, setShowCSVUpload] = useState(false);
    const [csvFile, setCsvFile] = useState(null);
    const [formData, setFormData] = useState({
        nama: '',
        stok: '',
        satuan: '',
        kondisi: 'Baik',
        terakhirDiperiksa: new Date().toISOString().split('T')[0]
    });
    const [editingItem, setEditingItem] = useState(null);

    // Data dummy gudang
    const gudangData = {
        id: 1,
        namaGudang: "Gudang Pusat Jakarta",
        alamat: "Jl. Sudirman No. 123, Jakarta Selatan",
        pic: "Budi Santoso",
        kontak: "0812-3456-7890",
        status: "Aktif",
    };
    
    // State for materials and inventory with initial dummy data
    const [materialData, setMaterialData] = useState([
        { id: 1, nama: "Kayu Jati", stok: 150, satuan: "m3" },
        { id: 2, nama: "Semen", stok: 500, satuan: "sak" },
    ]);
    
    const [inventoryData, setInventoryData] = useState([
        { id: 1, nama: "Mesin Bor", kondisi: "Baik", terakhirDiperiksa: "2023-05-15" },
        { id: 2, nama: "Gerinda", kondisi: "Perlu Servis", terakhirDiperiksa: "2023-06-01" },
    ]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddItem = (e) => {
        e.preventDefault();
        
        if (activeTab === 'material') {
            const newMaterial = {
                id: materialData.length + 1,
                nama: formData.nama,
                stok: parseInt(formData.stok),
                satuan: formData.satuan
            };
            setMaterialData([...materialData, newMaterial]);
        } else {
            const newInventory = {
                id: inventoryData.length + 1,
                nama: formData.nama,
                kondisi: formData.kondisi,
                terakhirDiperiksa: formData.terakhirDiperiksa
            };
            setInventoryData([...inventoryData, newInventory]);
        }
        
        // Reset form
        setFormData({
            nama: '',
            stok: '',
            satuan: '',
            kondisi: 'Baik',
            terakhirDiperiksa: new Date().toISOString().split('T')[0]
        });
        setShowAddForm(false);
    };

    const handleCSVUpload = (e) => {
        e.preventDefault();
        if (!csvFile) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            const lines = content.split('\n');
            const headers = lines[0].split(',');
            
            const newItems = [];
            for (let i = 1; i < lines.length; i++) {
                if (!lines[i].trim()) continue;
                
                const values = lines[i].split(',');
                const item = {};
                for (let j = 0; j < headers.length; j++) {
                    item[headers[j].trim()] = values[j] ? values[j].trim() : '';
                }
                
                if (activeTab === 'material') {
                    item.id = materialData.length + newItems.length + 1;
                    item.stok = parseInt(item.stok) || 0;
                    newItems.push(item);
                } else {
                    item.id = inventoryData.length + newItems.length + 1;
                    newItems.push(item);
                }
            }
            
            if (activeTab === 'material') {
                setMaterialData([...materialData, ...newItems]);
            } else {
                setInventoryData([...inventoryData, ...newItems]);
            }
            
            setCsvFile(null);
            setShowCSVUpload(false);
        };
        reader.readAsText(csvFile);
    };

    const handleDeleteItem = (id) => {
        if (activeTab === 'material') {
            setMaterialData(materialData.filter(item => item.id !== id));
        } else {
            setInventoryData(inventoryData.filter(item => item.id !== id));
        }
    };

    const handleEditInventory = (item) => {
        setEditingItem(item);
        setFormData({
            nama: item.nama,
            kondisi: item.kondisi,
            terakhirDiperiksa: item.terakhirDiperiksa
        });
        setShowAddForm(true);
    };

    const handleUpdateItem = (e) => {
        e.preventDefault();
        
        if (activeTab === 'inventory' && editingItem) {
            const updatedInventory = inventoryData.map(item => 
                item.id === editingItem.id ? {
                    ...item,
                    nama: formData.nama,
                    kondisi: formData.kondisi,
                    terakhirDiperiksa: formData.terakhirDiperiksa
                } : item
            );
            setInventoryData(updatedInventory);
        }
        
        setEditingItem(null);
        setFormData({
            nama: '',
            stok: '',
            satuan: '',
            kondisi: 'Baik',
            terakhirDiperiksa: new Date().toISOString().split('T')[0]
        });
        setShowAddForm(false);
    };

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-9xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <h1 className="text-2xl font-bold text-[#0D47A1] mb-4 md:mb-0 flex items-center gap-2">
                        <Warehouse className="w-6 h-6" />
                        Detail Gudang
                    </h1>
                    <Header />
                </div>

                {/* Warehouse Info */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
                    <div className="bg-[#2196F3] p-5 text-white">
                        <h2 className="text-xl font-semibold">{gudangData.namaGudang}</h2>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-[#0D47A1]">Alamat:</p>
                                <p className="text-[#0D47A1]">{gudangData.alamat}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-[#0D47A1]">PIC Gudang:</p>
                                <p className="text-[#0D47A1]">{gudangData.pic}</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-[#0D47A1]">Kontak:</p>
                                <p className="text-[#0D47A1]">{gudangData.kontak}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-[#0D47A1]">Status:</p>
                                <span className={`px-2 py-1 text-xs rounded-full ${gudangData.status === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {gudangData.status}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
                    <div className="border-b">
                        <nav className="flex -mb-px">
                            <button
                                onClick={() => {
                                    setActiveTab('material');
                                    setShowAddForm(false);
                                    setShowCSVUpload(false);
                                    setEditingItem(null);
                                }}
                                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium ${activeTab === 'material' ? 'text-[#2196F3] border-b-2 border-[#2196F3]' : 'text-[#0D47A1] hover:text-[#1A365D]'}`}
                            >
                                <Box className="w-4 h-4" />
                                Material
                            </button>
                            <button
                                onClick={() => {
                                    setActiveTab('inventory');
                                    setShowAddForm(false);
                                    setShowCSVUpload(false);
                                    setEditingItem(null);
                                }}
                                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium ${activeTab === 'inventory' ? 'text-[#2196F3] border-b-2 border-[#2196F3]' : 'text-[#0D47A1] hover:text-[#1A365D]'}`}
                            >
                                <Package className="w-4 h-4" />
                                Inventory
                            </button>
                        </nav>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowAddForm(true);
                                    setShowCSVUpload(false);
                                    setEditingItem(null);
                                }}
                                className="flex items-center gap-2 bg-[#2196F3] hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition-colors duration-200"
                            >
                                <Plus className="w-4 h-4" />
                                {editingItem ? 'Edit' : 'Tambah'} {activeTab === 'material' ? 'Material' : 'Inventory'}
                            </button>
                            <button
                                onClick={() => {
                                    setShowCSVUpload(true);
                                    setShowAddForm(false);
                                    setEditingItem(null);
                                }}
                                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md transition-colors duration-200"
                            >
                                <Upload className="w-4 h-4" />
                                Upload CSV
                            </button>
                        </div>
                    </div>
                    
                    {/* Add/Edit Form */}
                    {showAddForm && (
                        <div className="p-6 border-b">
                            <h3 className="text-lg font-semibold mb-4 text-[#0D47A1]">
                                {editingItem ? 'Edit' : 'Tambah'} {activeTab === 'material' ? 'Material' : 'Inventory'} Baru
                            </h3>
                            <form onSubmit={editingItem ? handleUpdateItem : handleAddItem} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-[#0D47A1] mb-1">
                                        Nama {activeTab === 'material' ? 'Material' : 'Inventory'}
                                    </label>
                                    <input
                                        type="text"
                                        name="nama"
                                        value={formData.nama}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-[#CFD8DC] rounded-lg text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                                        required
                                    />
                                </div>
                                
                                {activeTab === 'material' ? (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-[#0D47A1] mb-1">Stok</label>
                                            <input
                                                type="number"
                                                name="stok"
                                                value={formData.stok}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-[#CFD8DC] rounded-lg text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#0D47A1] mb-1">Satuan</label>
                                            <input
                                                type="text"
                                                name="satuan"
                                                value={formData.satuan}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-[#CFD8DC] rounded-lg text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                                                required
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-[#0D47A1] mb-1">Kondisi</label>
                                            <select
                                                name="kondisi"
                                                value={formData.kondisi}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-[#CFD8DC] rounded-lg text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                                                required
                                            >
                                                <option value="Baik">Baik</option>
                                                <option value="Perlu Perbaikan">Perlu Perbaikan</option>
                                                <option value="Perlu Servis">Perlu Servis</option>
                                                <option value="Rusak">Rusak</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#0D47A1] mb-1">Terakhir Diperiksa</label>
                                            <input
                                                type="date"
                                                name="terakhirDiperiksa"
                                                value={formData.terakhirDiperiksa}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-[#CFD8DC] rounded-lg text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                                                required
                                            />
                                        </div>
                                    </>
                                )}
                                
                                <div className="md:col-span-2 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowAddForm(false);
                                            setEditingItem(null);
                                        }}
                                        className="px-4 py-2 border border-[#CFD8DC] rounded-lg text-[#0D47A1] bg-white hover:bg-gray-50"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-[#2196F3] text-white rounded-lg hover:bg-blue-600"
                                    >
                                        {editingItem ? 'Update' : 'Simpan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                    
                    {/* CSV Upload Form */}
                    {showCSVUpload && (
                        <div className="p-6 border-b">
                            <h3 className="text-lg font-semibold mb-4 text-[#0D47A1]">Upload Data dari CSV</h3>
                            <form onSubmit={handleCSVUpload}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-[#0D47A1] mb-1">
                                        Pilih File CSV
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="file"
                                            accept=".csv"
                                            onChange={(e) => setCsvFile(e.target.files[0])}
                                            className="block w-full text-sm text-[#0D47A1]
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded-md file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-blue-50 file:text-[#2196F3]
                                            hover:file:bg-blue-100"
                                            required
                                        />
                                    </div>
                                    <p className="mt-1 text-sm text-[#0D47A1]">
                                        Format CSV harus sesuai dengan struktur data {activeTab}.
                                    </p>
                                    {activeTab === 'material' && (
                                        <p className="mt-1 text-xs text-[#0D47A1]">
                                            Contoh header: nama,stok,satuan
                                        </p>
                                    )}
                                    {activeTab === 'inventory' && (
                                        <p className="mt-1 text-xs text-[#0D47A1]">
                                            Contoh header: nama,kondisi,terakhirDiperiksa
                                        </p>
                                    )}
                                </div>
                                
                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowCSVUpload(false)}
                                        className="px-4 py-2 border border-[#CFD8DC] rounded-lg text-[#0D47A1] bg-white hover:bg-gray-50"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                    >
                                        Upload
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                    
                    {/* Tab Content */}
                    <div className="p-6">
                        {activeTab === 'material' && (
                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-[#0D47A1]">Material di Gudang Ini</h3>
                                {materialData.length === 0 ? (
                                    <p className="text-[#0D47A1]">Belum ada data material.</p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-[#2196F3]">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">No</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Nama Material</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Stok</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Satuan</th>
                                                    <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {materialData.map((item, index) => (
                                                    <tr key={item.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#0D47A1]">{index + 1}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#0D47A1]">{item.nama}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#0D47A1]">{item.stok}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#0D47A1]">{item.satuan}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-[#0D47A1]">
                                                            <button
                                                                onClick={() => handleDeleteItem(item.id)}
                                                                className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                                                                title="Hapus"
                                                            >
                                                                <X className="w-5 h-5" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {activeTab === 'inventory' && (
                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-[#0D47A1]">Inventory di Gudang Ini</h3>
                                {inventoryData.length === 0 ? (
                                    <p className="text-[#0D47A1]">Belum ada data inventory.</p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-[#2196F3]">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">No</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Nama Inventory</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Kondisi</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Terakhir Diperiksa</th>
                                                    <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {inventoryData.map((item, index) => (
                                                    <tr key={item.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#0D47A1]">{index + 1}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#0D47A1]">{item.nama}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                                item.kondisi === 'Baik' ? 'bg-green-100 text-green-800' : 
                                                                item.kondisi === 'Perlu Servis' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-red-100 text-red-800'
                                                            }`}>
                                                                {item.kondisi}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#0D47A1]">{item.terakhirDiperiksa}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-[#0D47A1]">
                                                            <div className="flex justify-end gap-2">
                                                                <button
                                                                    onClick={() => handleEditInventory(item)}
                                                                    className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-50 transition-colors"
                                                                    title="Edit"
                                                                >
                                                                    <Edit className="w-5 h-5" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteItem(item.id)}
                                                                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                                                                    title="Hapus"
                                                                >
                                                                    <X className="w-5 h-5" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                
                <button 
                    onClick={() => window.history.back()} 
                    className="px-5 py-2 border border-[#CFD8DC] rounded-lg text-[#0D47A1] bg-white hover:bg-gray-50"
                >
                    Kembali ke Daftar Gudang
                </button>
            </div>
        </div>
    );
};

export default DetailGudang;