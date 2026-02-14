import React from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Plus, Search, AlertCircle, Users } from "lucide-react";
import useRoles from "./hooks/useRoles";
import RoleTable from "./component/RoleTable";

const RoleListPage = () => {
  const navigate = useNavigate();
  const {
    roles,
    pagination,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    setPage,
    refresh,
  } = useRoles();

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0D47A1] flex items-center gap-2">
            <Shield className="w-7 h-7" />
            Manajemen Role & Akses
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Atur peran pengguna dan batasan hak akses aplikasi.
          </p>
        </div>

        <button
          onClick={() => navigate("/roles/create")}
          className="bg-[#2196F3] text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Tambah Role Baru
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Cari role..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <RoleTable
        roles={roles}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={setPage}
        onRefresh={refresh}
      />
    </div>
  );
};

export default RoleListPage;
