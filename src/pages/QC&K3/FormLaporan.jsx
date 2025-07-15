import React, { useState } from "react";
import Header from "@/Components/Header/Header";
import { useNavigate } from "react-router-dom";
import { X, Check, HardHat, ClipboardList, AlertTriangle, Calendar, Users, Upload, Plus, Trash2 } from "lucide-react";

const QCForm = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasIncident, setHasIncident] = useState(false);

  const [formData, setFormData] = useState({
    projectName: "",
    projectLocation: "",
    inspectionDate: "",
    weatherCondition: "",
    generalCondition: "",
    additionalNotes: "",
    documentation: null,
    apdItems: [
      { name: "Helm Safety", available: false, condition: "" },
      { name: "Rompi Safety", available: false, condition: "" },
      { name: "Sepatu Safety", available: false, condition: "" },
      { name: "Sarung Tangan", available: false, condition: "" },
      { name: "Kacamata Safety", available: false, condition: "" },
      { name: "Masker", available: false, condition: "" },
    ],
    additionalApd: [],
    areaInspections: [
      { item: "Housekeeping", condition: "", notes: "" },
      { item: "Pencahayaan", condition: "", notes: "" },
      { item: "Ventilasi", condition: "", notes: "" },
      { item: "Jalur Evakuasi", condition: "", notes: "" },
    ],
    incident: {
      date: "",
      location: "",
      description: "",
      actionTaken: "",
      followUp: ""
    },
    personnelName: "",
    personnelPosition: "",
    personnelNote: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, documentation: e.target.files[0] }));
  };

  const handleApdChange = (index, field, value) => {
    const updatedApd = [...formData.apdItems];
    updatedApd[index] = { ...updatedApd[index], [field]: value };
    setFormData(prev => ({ ...prev, apdItems: updatedApd }));
  };

  const handleAddApd = () => {
    setFormData(prev => ({
      ...prev,
      additionalApd: [...prev.additionalApd, { name: "", available: false, condition: "" }]
    }));
  };

  const handleRemoveApd = (index) => {
    const updatedApd = [...formData.additionalApd];
    updatedApd.splice(index, 1);
    setFormData(prev => ({ ...prev, additionalApd: updatedApd }));
  };

  const handleAdditionalApdChange = (index, field, value) => {
    const updatedApd = [...formData.additionalApd];
    updatedApd[index] = { ...updatedApd[index], [field]: value };
    setFormData(prev => ({ ...prev, additionalApd: updatedApd }));
  };

  const handleAreaInspectionChange = (index, field, value) => {
    const updatedInspections = [...formData.areaInspections];
    updatedInspections[index] = { ...updatedInspections[index], [field]: value };
    setFormData(prev => ({ ...prev, areaInspections: updatedInspections }));
  };

  const handleIncidentChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      incident: { ...prev.incident, [field]: value }
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.projectName) newErrors.projectName = "Nama proyek wajib diisi";
    if (!formData.projectLocation) newErrors.projectLocation = "Lokasi proyek wajib diisi";
    if (!formData.inspectionDate) newErrors.inspectionDate = "Tanggal inspeksi wajib diisi";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Form submitted:", formData);
      setIsSubmitting(false);
      navigate("/qc-k3", { state: { success: true } });
    }, 1500);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="max-w-9xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-2xl font-bold text-[#0D47A1] mb-4 md:mb-0">Formulir QC & K3</h1>
          <Header />
        </div>

        <form onSubmit={handleSubmit}>
          {/* Project Information Section */}
          <div className="bg-white rounded-xl shadow-sm mb-8 border border-gray-100">
            <div className="bg-[#2196F3] rounded-t-xl p-5">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Informasi Umum Proyek
              </h2>
            </div>
            <div className="p-4 sm:p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-[#0D47A1] mb-1">Nama Proyek*</label>
                    <input
                      type="text"
                      name="projectName"
                      value={formData.projectName}
                      onChange={handleChange}
                      className={`w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition ${errors.projectName ? 'border-red-500' : ''}`}
                      placeholder="Masukkan nama proyek"
                      required
                    />
                    {errors.projectName && <p className="text-red-500 text-xs mt-1">{errors.projectName}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#0D47A1] mb-1">Tanggal Inspeksi*</label>
                    <input
                      type="date"
                      name="inspectionDate"
                      value={formData.inspectionDate}
                      onChange={handleChange}
                      className={`w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition ${errors.inspectionDate ? 'border-red-500' : ''}`}
                      required
                    />
                    {errors.inspectionDate && <p className="text-red-500 text-xs mt-1">{errors.inspectionDate}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#0D47A1] mb-1">Kondisi Umum</label>
                    <textarea
                      name="generalCondition"
                      value={formData.generalCondition}
                      onChange={handleChange}
                      rows={3}
                      className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                      placeholder="Deskripsi kondisi umum proyek"
                    />
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-[#0D47A1] mb-1">Lokasi Proyek*</label>
                    <input
                      type="text"
                      name="projectLocation"
                      value={formData.projectLocation}
                      onChange={handleChange}
                      className={`w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition ${errors.projectLocation ? 'border-red-500' : ''}`}
                      placeholder="Masukkan lokasi proyek"
                      required
                    />
                    {errors.projectLocation && <p className="text-red-500 text-xs mt-1">{errors.projectLocation}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#0D47A1] mb-1">Kondisi Cuaca</label>
                    <input
                      type="text"
                      name="weatherCondition"
                      value={formData.weatherCondition}
                      onChange={handleChange}
                      className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                      placeholder="Mis: Cerah, Hujan, dll"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#0D47A1] mb-1">Dokumentasi</label>
                    <div className="flex items-center gap-3">
                      <label className="cursor-pointer">
                        <div className="px-5 py-2.5 border border-[#CFD8DC] rounded-lg bg-white hover:bg-gray-50 flex items-center gap-2 text-sm font-medium text-[#0D47A1] transition-colors">
                          <Upload className="w-4 h-4" />
                          <span>Unggah Foto</span>
                        </div>
                        <input
                          type="file"
                          name="documentation"
                          onChange={handleFileChange}
                          className="hidden"
                          accept="image/*"
                        />
                      </label>
                      {formData.documentation && (
                        <span className="text-sm text-[#0D47A1] flex items-center gap-1">
                          <Check className="w-4 h-4 text-green-500" />
                          {formData.documentation.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* APD Section */}
          <div className="bg-white rounded-xl shadow-sm mb-8 border border-gray-100">
            <div className="bg-[#2196F3] rounded-t-xl p-5">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <HardHat className="w-5 h-5" />
                Pemeriksaan Alat Pelindung Diri (APD)
              </h2>
            </div>
            <div className="p-4 sm:p-6 space-y-5">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#0D47A1] uppercase tracking-wider">APD</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#0D47A1] uppercase tracking-wider">Tersedia</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#0D47A1] uppercase tracking-wider">Kondisi</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#0D47A1] uppercase tracking-wider w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {formData.apdItems.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#0D47A1]">{item.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center h-5">
                            <input
                              type="checkbox"
                              checked={item.available}
                              onChange={(e) => handleApdChange(index, 'available', e.target.checked)}
                              className="h-4 w-4 text-[#2196F3] focus:ring-[#2196F3] border-gray-300 rounded"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            value={item.condition}
                            onChange={(e) => handleApdChange(index, 'condition', e.target.value)}
                            className="w-full px-3 py-2 border border-[#CFD8DC] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                            placeholder="Kondisi APD"
                            disabled={!item.available}
                          />
                        </td>
                        <td></td>
                      </tr>
                    ))}
                    {formData.additionalApd.map((item, index) => (
                      <tr key={`additional-${index}`} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => handleAdditionalApdChange(index, 'name', e.target.value)}
                            className="w-full px-3 py-2 border border-[#CFD8DC] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                            placeholder="Nama APD"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center h-5">
                            <input
                              type="checkbox"
                              checked={item.available}
                              onChange={(e) => handleAdditionalApdChange(index, 'available', e.target.checked)}
                              className="h-4 w-4 text-[#2196F3] focus:ring-[#2196F3] border-gray-300 rounded"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            value={item.condition}
                            onChange={(e) => handleAdditionalApdChange(index, 'condition', e.target.value)}
                            className="w-full px-3 py-2 border border-[#CFD8DC] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                            placeholder="Kondisi APD"
                            disabled={!item.available}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveApd(index)}
                            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                            title="Hapus APD"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                type="button"
                onClick={handleAddApd}
                className="text-[#2196F3] hover:text-blue-600 font-medium flex items-center gap-2 text-sm"
              >
                <span className="bg-blue-100 text-[#2196F3] rounded-full p-1">
                  <Plus className="w-4 h-4" />
                </span>
                Tambah APD Lainnya
              </button>
            </div>
          </div>

          {/* Work Area Inspection Section */}
          <div className="bg-white rounded-xl shadow-sm mb-8 border border-gray-100">
            <div className="bg-[#2196F3] rounded-t-xl p-5">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <ClipboardList className="w-5 h-5" />
                Pemeriksaan Area Kerja
              </h2>
            </div>
            <div className="p-4 sm:p-6 space-y-5">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#0D47A1] uppercase tracking-wider">Item Pemeriksaan</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#0D47A1] uppercase tracking-wider">Kondisi</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#0D47A1] uppercase tracking-wider">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {formData.areaInspections.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#0D47A1]">{item.item}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            value={item.condition}
                            onChange={(e) => handleAreaInspectionChange(index, 'condition', e.target.value)}
                            className="w-full px-3 py-2 border border-[#CFD8DC] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                            placeholder="Kondisi"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            value={item.notes}
                            onChange={(e) => handleAreaInspectionChange(index, 'notes', e.target.value)}
                            className="w-full px-3 py-2 border border-[#CFD8DC] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                            placeholder="Keterangan"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Incident Report Section */}
          <div className="bg-white rounded-xl shadow-sm mb-8 border border-gray-100">
            <div className="bg-[#F44336] rounded-t-xl p-5">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Laporan Insiden
              </h2>
            </div>
            <div className="p-4 sm:p-6 space-y-5">
              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  checked={hasIncident}
                  onChange={() => setHasIncident(!hasIncident)}
                  className="h-4 w-4 text-[#F44336] focus:ring-[#F44336] border-gray-300 rounded"
                  id="hasIncident"
                />
                <label htmlFor="hasIncident" className="ml-2 block text-sm text-[#0D47A1]">
                  Ada insiden yang perlu dilaporkan
                </label>
              </div>

              {hasIncident && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#0D47A1] mb-1">Tanggal Insiden</label>
                    <input
                      type="date"
                      value={formData.incident.date}
                      onChange={(e) => handleIncidentChange('date', e.target.value)}
                      className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#0D47A1] mb-1">Lokasi Insiden</label>
                    <input
                      type="text"
                      value={formData.incident.location}
                      onChange={(e) => handleIncidentChange('location', e.target.value)}
                      className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                      placeholder="Lokasi insiden"
                    />
                  </div>
                  
                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-sm font-medium text-[#0D47A1] mb-1">Deskripsi Insiden</label>
                    <textarea
                      value={formData.incident.description}
                      onChange={(e) => handleIncidentChange('description', e.target.value)}
                      rows={3}
                      className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                      placeholder="Deskripsi lengkap insiden"
                    />
                  </div>
                  
                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-sm font-medium text-[#0D47A1] mb-1">Tindakan yang Dilakukan</label>
                    <textarea
                      value={formData.incident.actionTaken}
                      onChange={(e) => handleIncidentChange('actionTaken', e.target.value)}
                      rows={2}
                      className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                      placeholder="Tindakan yang dilakukan saat insiden"
                    />
                  </div>
                  
                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-sm font-medium text-[#0D47A1] mb-1">Tindak Lanjut</label>
                    <textarea
                      value={formData.incident.followUp}
                      onChange={(e) => handleIncidentChange('followUp', e.target.value)}
                      rows={2}
                      className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                      placeholder="Rencana tindak lanjut"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Personnel Section */}
          <div className="bg-white rounded-xl shadow-sm mb-8 border border-gray-100">
            <div className="bg-[#2196F3] rounded-t-xl p-5">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Users className="w-5 h-5" />
                Petugas Pemeriksa
              </h2>
            </div>
            <div className="p-4 sm:p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#0D47A1] mb-1">Nama Petugas*</label>
                  <input
                    type="text"
                    name="personnelName"
                    value={formData.personnelName}
                    onChange={handleChange}
                    className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                    placeholder="Nama lengkap petugas"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0D47A1] mb-1">Jabatan*</label>
                  <input
                    type="text"
                    name="personnelPosition"
                    value={formData.personnelPosition}
                    onChange={handleChange}
                    className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                    placeholder="Jabatan petugas"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#0D47A1] mb-1">Catatan Tambahan</label>
                  <textarea
                    name="personnelNote"
                    value={formData.personnelNote}
                    onChange={handleChange}
                    rows={2}
                    className="w-full border border-[#CFD8DC] rounded-lg px-4 py-2 text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
                    placeholder="Tambahan catatan dari petugas"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4 sticky bottom-0 bg-white p-4 border-t border-gray-200 -mx-6 -mb-8">
            <button
              type="button"
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium px-6 py-2 rounded-lg shadow-md transition-colors duration-200"
              onClick={() => navigate("/qc-k3")}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#2196F3] hover:bg-blue-600 text-white font-medium px-6 py-2 rounded-lg shadow-md transition-colors duration-200 disabled:opacity-70 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Menyimpan...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Simpan Laporan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QCForm;