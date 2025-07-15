import React, { useState, useRef } from "react";
import Header from "@/Components/Header/Header";
import { Upload as UploadIcon, FileText, X, Plus, Download } from "lucide-react";

const AddProjectForm = () => {
    // State for work items
    const [workItems, setWorkItems] = useState([]);
    const [newWorkItem, setNewWorkItem] = useState({
        name: "", unit: "", volume: "", price: "", amount: ""
    });
    const [showWorkForm, setShowWorkForm] = useState(false);

    // State for project data
    const [projectData, setProjectData] = useState({
        nomorKontrak: "", namaProyek: "", kategoriProyek: "", jenisKontrak: "",
        tanggalMulai: "", tanggalSelesai: "", nilaiKontrak: "", sumberPendanaan: "",
        lokasiProyek: "", pemberiPekerjaan: "", status: "", longitude: "",
        latitude: "", projectManager: ""
    });

    // State for documents
    const [documents, setDocuments] = useState([]);
    const [newDocument, setNewDocument] = useState({
        name: "", file: null
    });
    const [showDocumentForm, setShowDocumentForm] = useState(false);
    const fileInputRef = useRef(null);

    // Handlers for project data
    const handleProjectChange = (e) => {
        const { name, value } = e.target;
        setProjectData(prev => ({ ...prev, [name]: value }));
    };

    // Handlers for work items
    const handleWorkItemChange = (e) => {
        const { name, value } = e.target;
        setNewWorkItem(prev => ({ ...prev, [name]: value }));
    };

    const addWorkItem = () => {
        if (newWorkItem.name && newWorkItem.unit && newWorkItem.volume && newWorkItem.price) {
            const amount = parseFloat(newWorkItem.volume) * parseFloat(newWorkItem.price);
            const item = {
                ...newWorkItem,
                amount: amount.toLocaleString('id-ID')
            };
            setWorkItems([...workItems, item]);
            setNewWorkItem({ name: "", unit: "", volume: "", price: "", amount: "" });
            setShowWorkForm(false);
        }
    };

    const deleteWorkItem = (index) => {
        const updatedItems = [...workItems];
        updatedItems.splice(index, 1);
        setWorkItems(updatedItems);
    };

    // Handlers for documents
    const handleDocumentChange = (e) => {
        const { name, value } = e.target;
        setNewDocument(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === "application/pdf") {
            setNewDocument(prev => ({
                ...prev,
                file,
                name: file.name
            }));
        } else {
            alert("Silakan pilih file PDF");
        }
    };

    const addDocument = () => {
        if (newDocument.name && newDocument.file) {
            const document = {
                id: Date.now(),
                name: newDocument.name,
                file: newDocument.file,
                size: (newDocument.file.size / (1024 * 1024)).toFixed(2) + " MB",
                uploadDate: new Date().toLocaleDateString('id-ID')
            };
            setDocuments([...documents, document]);
            setNewDocument({ name: "", file: null });
            setShowDocumentForm(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const deleteDocument = (id) => {
        setDocuments(documents.filter(doc => doc.id !== id));
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-600';
            case 'cancelled': return 'bg-red-500';
            case 'ongoing': return 'bg-yellow-500';
            case 'planning': return 'bg-[#2196F3]';
            default: return 'bg-[#2196F3]';
        }
    };
    return (
        <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-9xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <h1 className="text-2xl font-bold text-[#0D47A1] mb-4 md:mb-0">Tambah Proyek Baru</h1>
                    <Header />
                </div>

                {/* Project Details Card */}
                <div className="bg-white rounded-xl shadow-sm mb-8 border border-gray-100">
                    {/* Card Header with blue background */}
                    <div className="bg-[#2196F3] rounded-t-xl p-5 flex md:flex-row justify-between md:items-center">
                        <h2 className="text-xl font-semibold text-white">Detail Proyek</h2>
                        <select
                            className={` md:w-50 h-10 border rounded-3xl px-8 py-2 text-white focus:outline-none ${getStatusColor(projectData.status)}`}
                            value={projectData.status}
                            name="status"
                            onChange={handleProjectChange}
                        >
                            <option value="" className="bg-white text-[#0D47A1]">Project Status</option>
                            <option value="planning" className="bg-white text-[#0D47A1]">Planning</option>
                            <option value="ongoing" className="bg-white text-[#0D47A1]">Ongoing</option>
                            <option value="completed" className="bg-white text-[#0D47A1]">Completed</option>
                            <option value="cancelled" className="bg-white text-[#0D47A1]">Cancelled</option>
                        </select>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 sm:p-6 space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="md:col-span-1">
                                <label className="block text-sm font-medium text-[#0D47A1] mb-1">Nomor Kontrak</label>
                                <input
                                    className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1]  focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                                    placeholder="CTR-2023-001"
                                    name="nomorKontrak"
                                    value={projectData.nomorKontrak}
                                    onChange={handleProjectChange}
                                />
                            </div>
                            <div className="md:col-span-3">
                                <label className="block text-sm font-medium text-[#0D47A1] mb-1">Nama Proyek</label>
                                <input
                                    className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1]  focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                                    placeholder="Office Building Construction"
                                    name="namaProyek"
                                    value={projectData.namaProyek}
                                    onChange={handleProjectChange}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div className="md:col-span-1">
                                <label className="block text-sm font-medium text-[#0D47A1] mb-1">Kategori Proyek</label>
                                <input
                                    className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1]  focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                                    placeholder="Construction"
                                    name="kategoriProyek"
                                    value={projectData.kategoriProyek}
                                    onChange={handleProjectChange}
                                />
                            </div>
                            <div className="md:col-span-1">
                                <label className="block text-sm font-medium text-[#0D47A1] mb-1">Jenis Kontrak</label>
                                <input
                                    className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1]  focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                                    placeholder="Lump Sum"
                                    name="jenisKontrak"
                                    value={projectData.jenisKontrak}
                                    onChange={handleProjectChange}
                                />
                            </div>
                            <div className="md:col-span-1">
                                <label className="block text-sm font-medium text-[#0D47A1] mb-1">Nilai Kontrak</label>
                                <input
                                    className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1]  focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                                    placeholder="1,000,000,000"
                                    name="nilaiKontrak"
                                    value={projectData.nilaiKontrak}
                                    onChange={handleProjectChange}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-[#0D47A1] mb-1">Tanggal Mulai</label>
                                <input
                                    type="date"
                                    className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1]  focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                                    name="tanggalMulai"
                                    value={projectData.tanggalMulai}
                                    onChange={handleProjectChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#0D47A1] mb-1">Tanggal Selesai</label>
                                <input
                                    type="date"
                                    className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1]  focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                                    name="tanggalSelesai"
                                    value={projectData.tanggalSelesai}
                                    onChange={handleProjectChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#0D47A1] mb-1">Sumber Pendanaan</label>
                            <input
                                className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1]  focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                                placeholder="Company Budget"
                                name="sumberPendanaan"
                                value={projectData.sumberPendanaan}
                                onChange={handleProjectChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#0D47A1] mb-1">Pemberi Pekerjaan</label>
                            <input
                                className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1]  focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                                placeholder="PT. ABC Corporation"
                                name="pemberiPekerjaan"
                                value={projectData.pemberiPekerjaan}
                                onChange={handleProjectChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#0D47A1] mb-1">Lokasi Proyek</label>
                            <textarea
                                className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1]  focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition h-24"
                                placeholder="Jl. Sudirman No. 1, Jakarta Pusat"
                                name="lokasiProyek"
                                value={projectData.lokasiProyek}
                                onChange={handleProjectChange}
                            ></textarea>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-[#0D47A1] mb-1">Longitude</label>
                                <input
                                    className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1]  focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                                    placeholder="-6.2088"
                                    name="longitude"
                                    value={projectData.longitude}
                                    onChange={handleProjectChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#0D47A1] mb-1">Latitude</label>
                                <input
                                    className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1]  focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                                    placeholder="106.8456"
                                    name="latitude"
                                    value={projectData.latitude}
                                    onChange={handleProjectChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#0D47A1] mb-1">Project Manager</label>
                            <input
                                className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1]  focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                                placeholder="John Doe"
                                name="projectManager"
                                value={projectData.projectManager}
                                onChange={handleProjectChange}
                            />
                        </div>
                    </div>
                </div>

                {/* Detail Pekerjaan Card */}
                <div className="bg-white rounded-xl shadow-sm mb-8 border border-gray-100">
                    <div className="bg-[#2196F3] rounded-t-xl p-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                            <h2 className="text-xl font-semibold text-white mb-4 md:mb-0">Detail Pekerjaan</h2>
                            <div className="flex space-x-3 w-full md:w-auto">
                                <button className="bg-white hover:bg-gray-100 text-[#0D47A1] px-4 py-2 rounded-lg transition flex items-center">
                                    <UploadIcon className="w-4 h-4 mr-2" />
                                    Import CSV
                                </button>
                                <button
                                    className="bg-white hover:bg-gray-100 text-[#0D47A1] px-4 py-2 rounded-lg transition flex items-center"
                                    onClick={() => setShowWorkForm(true)}
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Work Item
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                        {showWorkForm && (
                            <div className="bg-gray-50 p-5 rounded-lg mb-6 border border-[#CFD8DC]">
                                <h3 className="font-medium text-[#0D47A1] mb-4">Add New Work Item</h3>
                                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-[#0D47A1] mb-1">Item Name</label>
                                        <input
                                            className="w-full border border-[#CFD8DC] rounded-lg px-3 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                                            placeholder="Concrete Work"
                                            name="name"
                                            value={newWorkItem.name}
                                            onChange={handleWorkItemChange}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#0D47A1] mb-1">Unit</label>
                                        <input
                                            className="w-full border border-[#CFD8DC] rounded-lg px-3 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                                            placeholder="m3"
                                            name="unit"
                                            value={newWorkItem.unit}
                                            onChange={handleWorkItemChange}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#0D47A1] mb-1">Volume</label>
                                        <input
                                            className="w-full border border-[#CFD8DC] rounded-lg px-3 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                                            placeholder="100"
                                            type="number"
                                            name="volume"
                                            value={newWorkItem.volume}
                                            onChange={handleWorkItemChange}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#0D47A1] mb-1">Price</label>
                                        <input
                                            className="w-full border border-[#CFD8DC] rounded-lg px-3 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                                            placeholder="1,000,000"
                                            type="number"
                                            name="price"
                                            value={newWorkItem.price}
                                            onChange={handleWorkItemChange}
                                        />
                                    </div>

                                    <div className="flex items-end space-x-2">
                                        <button
                                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition flex-1"
                                            onClick={addWorkItem}
                                        >
                                            Save
                                        </button>
                                        <button
                                            className="bg-gray-200 hover:bg-gray-300 text-[#0D47A1] px-3 py-2 rounded-lg transition flex-1"
                                            onClick={() => setShowWorkForm(false)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volume</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {workItems.length > 0 ? (
                                        workItems.map((item, index) => (
                                            <tr key={index}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#0D47A1]">{item.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.unit}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.volume}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.price}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.amount}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <button
                                                        className="text-red-600 hover:text-red-900"
                                                        onClick={() => deleteWorkItem(index)}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                                                No Detail Pekerjaan added yet
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                {/* Documents Card */}
                <div className="bg-white rounded-xl shadow-sm mb-8 border border-gray-100">
                    <div className="bg-[#2196F3] rounded-t-xl p-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                            <h2 className="text-xl font-semibold text-white mb-4 md:mb-0">Dokumen Proyek</h2>
                            <button
                                className="bg-white hover:bg-gray-100 text-[#0D47A1] px-4 py-2 rounded-lg transition flex items-center"
                                onClick={() => setShowDocumentForm(true)}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Tambah Dokumen
                            </button>
                        </div>
                    </div>

                    {showDocumentForm && (
                        <div className="bg-gray-50 p-5 rounded-lg border border-[#CFD8DC] mx-6 mt-4">
                            <h3 className="font-medium text-[#0D47A1] mb-4">Upload Dokumen Baru</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-[#0D47A1] mb-1">Nama Dokumen</label>
                                    <input
                                        className="w-full border border-[#CFD8DC] rounded-lg px-3 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                                        placeholder="Kontrak Proyek"
                                        name="name"
                                        value={newDocument.name}
                                        onChange={handleDocumentChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#0D47A1] mb-1">File PDF</label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            accept=".pdf"
                                            onChange={handleFileChange}
                                        />
                                        <div className="flex items-center justify-between border border-[#CFD8DC] rounded-lg px-3 py-2">
                                            <span className="text-sm text-gray-500 truncate">
                                                {newDocument.file ? newDocument.file.name : "Pilih file..."}
                                            </span>
                                            <UploadIcon className="w-4 h-4 text-gray-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end space-x-2 mt-4">
                                <button
                                    className="bg-gray-200 hover:bg-gray-300 text-[#0D47A1] px-4 py-2 rounded-lg transition"
                                    onClick={() => {
                                        setShowDocumentForm(false);
                                        setNewDocument({ name: "", file: null });
                                        if (fileInputRef.current) fileInputRef.current.value = "";
                                    }}
                                >
                                    Batal
                                </button>
                                <button
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
                                    onClick={addDocument}
                                    disabled={!newDocument.name || !newDocument.file}
                                >
                                    Simpan
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="p-6">
                        {documents.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Dokumen</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ukuran</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Upload</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {documents.map((doc) => (
                                            <tr key={doc.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <FileText className="flex-shrink-0 h-5 w-5 text-blue-500 mr-2" />
                                                        <span className="text-sm font-medium text-[#0D47A1]">{doc.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.size}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.uploadDate}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <div className="flex space-x-2">
                                                        <a
                                                            href={URL.createObjectURL(doc.file)}
                                                            download={doc.name}
                                                            className="text-blue-600 hover:text-blue-900 flex items-center"
                                                        >
                                                            <Download className="w-4 h-4 mr-1" /> Unduh
                                                        </a>
                                                        <button
                                                            className="text-red-600 hover:text-red-900 flex items-center"
                                                            onClick={() => deleteDocument(doc.id)}
                                                        >
                                                            <X className="w-4 h-4 mr-1" /> Hapus
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada dokumen</h3>
                                <p className="mt-1 text-sm text-gray-500">Tambahkan dokumen proyek seperti kontrak, gambar teknis, atau dokumen pendukung lainnya.</p>
                                <div className="mt-6">
                                    <button
                                        type="button"
                                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#2196F3] hover:bg-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2196F3]"
                                        onClick={() => setShowDocumentForm(true)}
                                    >
                                        <Plus className="-ml-1 mr-2 h-5 w-5" />
                                        Tambah Dokumen
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Save Project Button */}
                <div className="flex justify-end mb-8">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition">
                        Simpan Proyek
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddProjectForm;