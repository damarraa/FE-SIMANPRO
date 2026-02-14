import React, { useState, useEffect } from "react";
import { Search, Building, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useDepartments from "./hooks/useDepartments"; 
import DepartmentsTable from "./components/DepartmentsTable"; 

const DepartmentListPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { departmentsData, isLoading, fetchDepartments, removeDepartment } =
    useDepartments();

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDepartments({ page: 1, search });
    }, 500);
    return () => clearTimeout(timer);
  }, [search, fetchDepartments]);

  const handlePageChange = (newPage) => {
    fetchDepartments({ page: newPage, search });
  };

  const handleDelete = async (id) => {
    const success = await removeDepartment(id);
    if (success) {
      fetchDepartments({ page: departmentsData.current_page, search });
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold text-[#0D47A1] flex items-center gap-2">
          <Building className="w-6 h-6" /> Manajemen Departemen
        </h1>
        <button
          onClick={() => navigate("/departments/create")}
          className="bg-[#2196F3] hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg shadow-md flex items-center gap-2 transition-all transform active:scale-95"
        >
          <Plus size={18} /> Tambah Departemen
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8 p-4">
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama atau kode departemen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          />
        </div>
      </div>

      <DepartmentsTable
        data={departmentsData.data}
        pagination={departmentsData}
        isLoading={isLoading}
        onPageChange={handlePageChange}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default DepartmentListPage;
