import React from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Briefcase } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { usePermission } from "../../hooks/usePermission";
import useProjects from "./hooks/useProjects";
import ProjectsTable from "./components/ProjectsTable";

const ProjectListPage = () => {
  const navigate = useNavigate();
  const {
    projects,
    pagination,
    isLoading,
    searchTerm,
    setSearchTerm,
    setPage,
    refresh
  } = useProjects();
  const { can } = usePermission();

  const user = useAuthStore((state) => state.user);
  const firstRole = user?.roles?.[0];
  const userRole =
    (typeof firstRole === "object" ? firstRole.name : firstRole) || "Guest";

  const hasFullAccess = ["Admin", "Super Admin"].includes(userRole);

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold text-[#0D47A1] mb-8 flex items-center gap-2">
        <Briefcase className="w-6 h-6" />
        Daftar Proyek
      </h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0D47A1]" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-[#CFD8DC] rounded-lg text-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition"
              placeholder="Cari proyek..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* {can("create::project") && (
            <button
              onClick={() => navigate("/projects/create")}
              className="bg-[#2196F3] hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg shadow-md transition-colors duration-200 flex items-center gap-2 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Tambah Proyek Baru
            </button>
          )} */}

          {hasFullAccess && (
            <button
              onClick={() => navigate("/projects/create")}
              className="bg-[#2196F3] hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg shadow-md transition-colors duration-200 flex items-center gap-2 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Tambah Proyek Baru
            </button>
          )}
        </div>
      </div>

      <ProjectsTable
        projects={projects}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={setPage}
      />
    </div>
  );
};

export default ProjectListPage;
