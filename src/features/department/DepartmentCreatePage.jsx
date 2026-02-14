import React, { useState, useEffect } from "react";
import { ArrowLeft, Building, Save, Tag } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import useDepartments from "./hooks/useDepartments";

const DepartmentCreatePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const { submitDepartment, fetchDetail, departmentDetail } = useDepartments();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
  });

  useEffect(() => {
    if (isEditMode) {
      fetchDetail(id);
    }
  }, [id, isEditMode, fetchDetail]);

  useEffect(() => {
    if (isEditMode && departmentDetail) {
      setFormData({
        name: departmentDetail.name || "",
        code: departmentDetail.code || "",
        description: departmentDetail.description || "",
      });
    }
  }, [departmentDetail, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const finalValue = name === "code" ? value.toUpperCase() : value;
    setFormData((prev) => ({ ...prev, [name]: finalValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await submitDepartment(formData, id);
    setIsSubmitting(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-500 hover:text-blue-600 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h1 className="text-2xl font-bold text-[#0D47A1] mb-6 flex items-center gap-2">
          <Building className="w-6 h-6" />{" "}
          {isEditMode ? "Edit Departemen" : "Tambah Departemen Baru"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kode
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name="code"
                  required
                  maxLength={10}
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="IT / HR"
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none uppercase font-mono"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Departemen
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Contoh: Information Technology"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deskripsi
            </label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Deskripsi singkat tugas departemen ini..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            ></textarea>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-[#2196F3] hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg shadow-md disabled:bg-gray-300 transition"
            >
              <Save size={18} />
              {isSubmitting ? "Menyimpan..." : "Simpan Data"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepartmentCreatePage;
