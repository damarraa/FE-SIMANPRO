import React, { useState } from "react";
import Header from "@/Components/Header/Header";
import { MapPin, Phone, User, Box, Package, Plus, Trash2 } from "lucide-react";

const AddWarehouseForm = () => {
    const [warehouseData, setWarehouseData] = useState({
        namaGudang: "",
        alamat: "",
        pic: "",
        kontak: "",
        status: "Aktif",
        luas: "",
        kapasitas: "",
        jenisGudang: "",
        fasilitas: "",
        keterangan: "",
        materials: [],
        inventories: []
    });

    const [newMaterial, setNewMaterial] = useState({
        nama: "",
        stok: "",
        satuan: "",
        kategori: ""
    });

    const [newInventory, setNewInventory] = useState({
        nama: "",
        jumlah: "",
        kondisi: "Baik",
        keterangan: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setWarehouseData(prev => ({ ...prev, [name]: value }));
    };

    const handleMaterialChange = (e) => {
        const { name, value } = e.target;
        setNewMaterial(prev => ({ ...prev, [name]: value }));
    };

    const handleInventoryChange = (e) => {
        const { name, value } = e.target;
        setNewInventory(prev => ({ ...prev, [name]: value }));
    };

    const addMaterial = () => {
        if (newMaterial.nama && newMaterial.stok) {
            setWarehouseData(prev => ({
                ...prev,
                materials: [...prev.materials, newMaterial]
            }));
            setNewMaterial({
                nama: "",
                stok: "",
                satuan: "",
                kategori: ""
            });
        }
    };

    const addInventory = () => {
        if (newInventory.nama && newInventory.jumlah) {
            setWarehouseData(prev => ({
                ...prev,
                inventories: [...prev.inventories, newInventory]
            }));
            setNewInventory({
                nama: "",
                jumlah: "",
                kondisi: "Baik",
                keterangan: ""
            });
        }
    };

    const removeMaterial = (index) => {
        setWarehouseData(prev => ({
            ...prev,
            materials: prev.materials.filter((_, i) => i !== index)
        }));
    };

    const removeInventory = (index) => {
        setWarehouseData(prev => ({
            ...prev,
            inventories: prev.inventories.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Data Gudang yang akan dikirim:", warehouseData);
        // Kirim data ke backend
    };

    const statusColors = {
        Aktif: "bg-green-500",
        Nonaktif: "bg-gray-400",
    };

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-9xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <h1 className="text-2xl font-bold text-[#0D47A1] mb-4 md:mb-0">Tambah Gudang Baru</h1>
                    <Header />
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Warehouse Details Card */}
                    <div className="bg-white rounded-xl shadow-sm mb-6 border border-gray-100">
                        <div className="bg-[#2196F3] rounded-t-xl p-5 flex md:flex-row justify-between md:items-center">
                            <h2 className="text-xl font-semibold text-white">Detail Gudang</h2>
                            <select
                                className={`md:w-50 h-10 border rounded-3xl px-8 py-2 text-white focus:outline-none ${statusColors[warehouseData.status]}`}
                                value={warehouseData.status}
                                name="status"
                                onChange={handleChange}
                            >
                                <option value="Aktif" className="bg-white text-[#0D47A1]">Aktif</option>
                                <option value="Nonaktif" className="bg-white text-[#0D47A1]">Nonaktif</option>
                            </select>
                        </div>

                        <div className="p-4 sm:p-6 space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#0D47A1] mb-1">Nama Gudang</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <MapPin className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            className="w-full pl-10 border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                                            placeholder="Gudang Pusat Jakarta"
                                            name="namaGudang"
                                            value={warehouseData.namaGudang}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#0D47A1] mb-1">Jenis Gudang</label>
                                    <select
                                        className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                                        name="jenisGudang"
                                        value={warehouseData.jenisGudang}
                                        onChange={handleChange}
                                    >
                                        <option value="">Pilih Jenis Gudang</option>
                                        <option value="Gudang Kering">Gudang Kering</option>
                                        <option value="Gudang Dingin">Gudang Dingin</option>
                                        <option value="Gudang Bahan Baku">Gudang Bahan Baku</option>
                                        <option value="Gudang Produk Jadi">Gudang Produk Jadi</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#0D47A1] mb-1">Alamat Lengkap</label>
                                <textarea
                                    className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition h-24"
                                    placeholder="Jl. Sudirman No. 123, Jakarta Selatan"
                                    name="alamat"
                                    value={warehouseData.alamat}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#0D47A1] mb-1">PIC Gudang</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            className="w-full pl-10 border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                                            placeholder="Budi Santoso"
                                            name="pic"
                                            value={warehouseData.pic}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#0D47A1] mb-1">Kontak PIC</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Phone className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            className="w-full pl-10 border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                                            placeholder="0812-3456-7890"
                                            name="kontak"
                                            value={warehouseData.kontak}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#0D47A1] mb-1">Luas Gudang (m²)</label>
                                    <input
                                        type="number"
                                        className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                                        placeholder="500"
                                        name="luas"
                                        value={warehouseData.luas}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#0D47A1] mb-1">Kapasitas Gudang</label>
                                    <input
                                        className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                                        placeholder="1000 ton"
                                        name="kapasitas"
                                        value={warehouseData.kapasitas}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#0D47A1] mb-1">Fasilitas</label>
                                    <input
                                        className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                                        placeholder="Dock, Forklift, AC"
                                        name="fasilitas"
                                        value={warehouseData.fasilitas}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#0D47A1] mb-1">Keterangan Tambahan</label>
                                <textarea
                                    className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition h-24"
                                    placeholder="Catatan tambahan tentang gudang..."
                                    name="keterangan"
                                    value={warehouseData.keterangan}
                                    onChange={handleChange}
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Material Section */}
                    <div className="bg-white rounded-xl shadow-sm mb-6 border border-gray-100">
                        <div className="bg-[#4CAF50] rounded-t-xl p-5">
                            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                <Box className="h-5 w-5" />
                                Material Gudang
                            </h2>
                        </div>

                        <div className="p-4 sm:p-6 space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#0D47A1] mb-1">Nama Material</label>
                                    <input
                                        className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent transition"
                                        placeholder="Kayu Jati"
                                        name="nama"
                                        value={newMaterial.nama}
                                        onChange={handleMaterialChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#0D47A1] mb-1">Stok</label>
                                    <input
                                        type="number"
                                        className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent transition"
                                        placeholder="100"
                                        name="stok"
                                        value={newMaterial.stok}
                                        onChange={handleMaterialChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#0D47A1] mb-1">Satuan</label>
                                    <input
                                        className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent transition"
                                        placeholder="m3"
                                        name="satuan"
                                        value={newMaterial.satuan}
                                        onChange={handleMaterialChange}
                                    />
                                </div>
                                <div className="flex items-end">
                                    <button
                                        type="button"
                                        onClick={addMaterial}
                                        className="bg-[#4CAF50] hover:bg-green-600 text-white font-medium px-4 py-2 rounded-lg shadow-md transition-colors duration-200 flex items-center gap-2 w-full justify-center"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Tambah
                                    </button>
                                </div>
                            </div>

                            {/* List of Materials */}
                            {warehouseData.materials.length > 0 && (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-gray-700">
                                        <thead className="bg-gray-50">
                                            <tr className="border-b">
                                                <th className="px-6 py-3 font-semibold">No</th>
                                                <th className="px-6 py-3 font-semibold">Nama Material</th>
                                                <th className="px-6 py-3 font-semibold">Stok</th>
                                                <th className="px-6 py-3 font-semibold">Satuan</th>
                                                <th className="px-6 py-3 font-semibold text-right">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {warehouseData.materials.map((material, index) => (
                                                <tr key={index} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4">{index + 1}</td>
                                                    <td className="px-6 py-4 font-medium">{material.nama}</td>
                                                    <td className="px-6 py-4">{material.stok}</td>
                                                    <td className="px-6 py-4">{material.satuan}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button
                                                            type="button"
                                                            onClick={() => removeMaterial(index)}
                                                            className="text-red-500 hover:text-red-700"
                                                        >
                                                            <Trash2 className="h-5 w-5" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Inventory Section */}
                    <div className="bg-white rounded-xl shadow-sm mb-6 border border-gray-100">
                        <div className="bg-[#FF9800] rounded-t-xl p-5">
                            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Inventory Gudang
                            </h2>
                        </div>

                        <div className="p-4 sm:p-6 space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#0D47A1] mb-1">Nama Inventory</label>
                                    <input
                                        className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#FF9800] focus:border-transparent transition"
                                        placeholder="Mesin Bor"
                                        name="nama"
                                        value={newInventory.nama}
                                        onChange={handleInventoryChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#0D47A1] mb-1">Jumlah</label>
                                    <input
                                        type="number"
                                        className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#FF9800] focus:border-transparent transition"
                                        placeholder="1"
                                        name="jumlah"
                                        value={newInventory.jumlah}
                                        onChange={handleInventoryChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#0D47A1] mb-1">Kondisi</label>
                                    <select
                                        className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#FF9800] focus:border-transparent transition"
                                        name="kondisi"
                                        value={newInventory.kondisi}
                                        onChange={handleInventoryChange}
                                    >
                                        <option value="Baik">Baik</option>
                                        <option value="Rusak Ringan">Rusak Ringan</option>
                                        <option value="Rusak Berat">Rusak Berat</option>
                                    </select>
                                </div>
                                <div className="flex items-end">
                                    <button
                                        type="button"
                                        onClick={addInventory}
                                        className="bg-[#FF9800] hover:bg-orange-600 text-white font-medium px-4 py-2 rounded-lg shadow-md transition-colors duration-200 flex items-center gap-2 w-full justify-center"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Tambah
                                    </button>
                                </div>
                            </div>

                            {/* List of Inventories */}
                            {warehouseData.inventories.length > 0 && (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-gray-700">
                                        <thead className="bg-gray-50">
                                            <tr className="border-b">
                                                <th className="px-6 py-3 font-semibold">No</th>
                                                <th className="px-6 py-3 font-semibold">Nama Inventory</th>
                                                <th className="px-6 py-3 font-semibold">Jumlah</th>
                                                <th className="px-6 py-3 font-semibold">Kondisi</th>
                                                <th className="px-6 py-3 font-semibold text-right">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {warehouseData.inventories.map((inventory, index) => (
                                                <tr key={index} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4">{index + 1}</td>
                                                    <td className="px-6 py-4 font-medium">{inventory.nama}</td>
                                                    <td className="px-6 py-4">{inventory.jumlah}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                            inventory.kondisi === 'Baik' ? 'bg-green-100 text-green-800' :
                                                            inventory.kondisi === 'Rusak Ringan' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-red-100 text-red-800'
                                                        }`}>
                                                            {inventory.kondisi}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button
                                                            type="button"
                                                            onClick={() => removeInventory(index)}
                                                            className="text-red-500 hover:text-red-700"
                                                        >
                                                            <Trash2 className="h-5 w-5" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4 pt-4">
                        <button
                            type="button"
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium px-6 py-2 rounded-lg shadow-md transition-colors duration-200"
                            onClick={() => window.history.back()}
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="bg-[#2196F3] hover:bg-blue-600 text-white font-medium px-6 py-2 rounded-lg shadow-md transition-colors duration-200"
                        >
                            Simpan Gudang
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddWarehouseForm;