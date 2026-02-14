import React, { useState, useEffect, useMemo, lazy, Suspense } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Briefcase, List } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import CurrencyInput from "react-currency-input-field";
// Import Hooks
import useProjectDetail from "./hooks/useProjectDetail";
// import useProjectTeam from "./hooks/useProjectTeam";
import useProjectWorkItems from "./hooks/useProjectWorkItems";
import useDailyReports from "./hooks/useDailyReports";
import useProjectExpenses from "./hooks/useProjectExpenses";
import useJobTypesList from "./hooks/useJobTypesList";
import useUsersByRole from "../../hooks/useUsersByRole";
import useWarehousesList from "../../hooks/useWarehousesList";
import useClientsList from "./hooks/useClientsList";
import useProjectVehicleAssignments from "./hooks/useProjectVehicleAssignments";
import useProjectMaterialRequisitions from "./hooks/useProjectMaterialRequisitions";
import useProjectToolRequisitions from "./hooks/useProjectToolRequisitions";
// Import Components
import DailyReportsTable from "./components/DailyReportsTable";
// import ProjectTeamTable from "./components/ProjectTeamTable";
import ProjectWorkItemsTable from "./components/ProjectWorkItemsTable";
import ProjectExpensesTable from "./components/ProjectExpensesTable";
import ProjectVehicleAssignmentsTable from "./components/ProjectVehicleAssignmentsTable";
import ProjectMaterialRequisitionsTable from "./components/ProjectMaterialRequisitionsTable";
import ProjectToolRequisitionsTable from "./components/ProjectToolRequisitionsTable";
import MapPicker from "../../Components/MapPicker";
import Swal from "sweetalert2";
import ProjectTeamSkeleton from "./components/ProjectTeamSkeleton";

const ProjectStatuses = ["On-Progress", "Completed", "Cancelled", "Pending"];

const ProjectDetailPage = () => {
  const navigate = useNavigate();
  const { id: projectId } = useParams();

  const user = useAuthStore((state) => state.user);
  const firstRole = user?.roles?.[0];
  const userRole =
    (typeof firstRole === "object" ? firstRole.name : firstRole) || "Guest";

  // Debugging
  // console.log("userRole saat ini adalah ", userRole);
  const hasFullAccess = ["Admin", "Super Admin"].includes(userRole);

  const {
    project,
    isLoading: isLoadingProject,
    update,
  } = useProjectDetail(projectId);

  // const {
  //   team,
  //   isLoading: isLoadingTeam,
  //   refresh: refreshTeam,
  // } = useProjectTeam(projectId);

  const ProjectTeamSection = lazy(() =>
    import("./components/ProjectTeamSection")
  );

  const {
    workItems,
    isLoading: isLoadingWorkItems,
    refresh: refreshWorkItems,
  } = useProjectWorkItems(projectId);

  const {
    reports,
    isLoading: isLoadingReports,
    refresh: refreshReports,
  } = useDailyReports(projectId);

  const {
    expenses,
    isLoading: isLoadingExpenses,
    refresh: refreshExpenses,
  } = useProjectExpenses(projectId);

  const {
    assignments,
    isLoading: isLoadingAssignments,
    refresh: refreshVehicles,
  } = useProjectVehicleAssignments(projectId);

  const {
    requisitions: materialRequisitions,
    isLoading: isLoadingMaterialRequisitions,
    refresh: refreshMaterialRequisitions,
  } = useProjectMaterialRequisitions(projectId);

  const {
    requisitions: toolRequisitions,
    isLoading: isLoadingToolRequisitions,
    refresh: refreshToolRequisitions,
  } = useProjectToolRequisitions(projectId);

  const { users: projectManagers, isLoading: isLoadingPMs } =
    useUsersByRole("Project Manager");
  const { clients, isLoading: isLoadingClients } = useClientsList();
  const { jobTypes, isLoading: isLoadingJobTypes } = useJobTypesList();
  const { warehouses, isLoading: isLoadingWarehouses } = useWarehousesList();

  const [formData, setFormData] = useState({
    contract_number: "",
    job_name: "",
    start_date: "",
    end_date: "",
    location: "",
    latitude: "",
    longitude: "",
    contract_type: "",
    fund_source: "",
    contract_value: 0,
    total_budget: 0,
    status: "On-Progress",
    job_id: null,
    client_id: null,
    project_manager_id: null,
    default_warehouse_id: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (
      project &&
      clients.length > 0 &&
      projectManagers.length > 0 &&
      jobTypes.length > 0 &&
      warehouses.length > 0
    ) {
      setFormData({
        contract_number: project.contract_number || "",
        job_name: project.job_name || "",
        start_date: project.start_date || "",
        end_date: project.end_date || "",
        location: project.location || "",
        latitude: project.latitude ? String(project.latitude) : "0.507067",
        longitude: project.longitude ? String(project.longitude) : "101.447779",
        contract_type: project.contract_type || "",
        fund_source: project.fund_source || "",
        contract_value: project.contract_value || "",
        total_budget: project.total_budget || "",
        status: project.status || "Pending",
        job_id:
          jobTypes.find((jt) => jt.name === project.job_category)?.id || "",
        client_id: clients.find((c) => c.name === project.client)?.id || "",
        project_manager_id:
          projectManagers.find((pm) => pm.name === project.project_manager)
            ?.id || "",
        default_warehouse_id:
          warehouses.find((w) => w.name === project.default_warehouse)?.id ||
          "",
      });
    }
  }, [project, clients, projectManagers, jobTypes, warehouses]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCurrencyChange = (value, name) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const sanitizeCurrency = (value) => {
    if (!value) return 0;
    return Number(value.toString().replace(/\D/g, ""));
  };

  const handleMapPositionChange = (newPosition) => {
    const [lat, lng] = newPosition;
    setFormData((prev) => ({
      ...prev,
      latitude: lat.toFixed(6),
      longitude: lng.toFixed(6),
    }));
  };

  const PEKANBARU_DEFAULT = [0.507067, 101.447779];

  const mapPosition = useMemo(() => {
    const lat = parseFloat(formData.latitude);
    const lng = parseFloat(formData.longitude);

    if (!isNaN(lat) && !isNaN(lng)) {
      return [lat, lng];
    }

    return PEKANBARU_DEFAULT;
  }, [formData.latitude, formData.longitude]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      contract_value: sanitizeCurrency(formData.contract_value),
      total_budget: sanitizeCurrency(formData.total_budget),
    };

    setLoading(true);
    setErrors({});
    try {
      await update(payload);
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data proyek baru berhasil diperbarui!",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        navigate("/projects");
      });
    } catch (err) {
      if (err.response && err.response.status === 422) {
        setErrors(err.response.data.errors);

        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
        });
        Toast.fire({
          icon: "warning",
          title: "Mohon periksa kembali inputan Anda.",
        });
      } else {
        setErrors({ general: "Gagal menyimpan data. Silakan coba lagi." });
        Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: err.response?.data?.message || "Terjadi kesalahan pada server.",
        });
      }

      // console.error("Error updating project: ", err);
    } finally {
      setLoading(false);
    }
  };

  if (isLoadingProject) return <div>Loading project details...</div>;

  return (
    <div className="w-full space-y-8">
      <h1 className="text-2xl font-bold text-[#0D47A1] flex items-center gap-2">
        <Briefcase className="w-6 h-6" />
        Edit Proyek: {project?.project_name}
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label
                htmlFor="job_name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nama Proyek
              </label>
              <input
                id="job_name"
                name="job_name"
                value={formData.job_name}
                onChange={handleChange}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.job_name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.job_name[0]}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="contract_number"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nomor Kontrak
              </label>
              <input
                id="contract_number"
                name="contract_number"
                value={formData.contract_number}
                onChange={handleChange}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.contract_number && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.contract_number[0]}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="client_id"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Klien
              </label>
              <select
                id="client_id"
                name="client_id"
                value={formData.client_id}
                onChange={handleChange}
                required
                disabled={isLoadingClients}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Pilih Klien</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="project_manager_id"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Project Manager
              </label>
              <select
                id="project_manager_id"
                name="project_manager_id"
                value={formData.project_manager_id}
                onChange={handleChange}
                required
                disabled={isLoadingPMs}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Pilih PM</option>
                {projectManagers.map((pm) => (
                  <option key={pm.id} value={pm.id}>
                    {pm.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="job_id"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Kategori Proyek
              </label>
              <select
                id="job_id"
                name="job_id"
                value={formData.job_id}
                onChange={handleChange}
                required
                disabled={isLoadingJobTypes}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Pilih Kategori</option>
                {jobTypes.map((jt) => (
                  <option key={jt.id} value={jt.id}>
                    {jt.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="default_warehouse_id"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Gudang Default
              </label>
              <select
                id="default_warehouse_id"
                name="default_warehouse_id"
                value={formData.default_warehouse_id}
                onChange={handleChange}
                required
                disabled={isLoadingWarehouses}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Pilih Gudang</option>
                {warehouses.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="start_date"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tanggal Mulai
              </label>
              <input
                id="start_date"
                name="start_date"
                type="date"
                value={formData.start_date}
                onChange={handleChange}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="end_date"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tanggal Selesai
              </label>
              <input
                id="end_date"
                name="end_date"
                type="date"
                value={formData.end_date}
                onChange={handleChange}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* {userRole === "Admin" ||
              (userRole === "Super Admin" && ( */}
            {hasFullAccess && (
              <>
                <div>
                  <label
                    htmlFor="fund_source"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Sumber Dana
                  </label>
                  <input
                    id="fund_source"
                    name="fund_source"
                    type="text"
                    value={formData.fund_source}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contract_type"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tipe Kontrak
                  </label>
                  <input
                    id="contract_type"
                    name="contract_type"
                    type="text"
                    value={formData.contract_type}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contract_value"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nilai Kontrak
                  </label>
                  <CurrencyInput
                    id="contract_value"
                    name="contract_value"
                    placeholder="Rp 0"
                    value={formData.contract_value}
                    decimalsLimit={2}
                    prefix="Rp "
                    groupSeparator="."
                    decimalSeparator=","
                    onValueChange={(value, name) =>
                      handleCurrencyChange(value, name)
                    }
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                  />

                  {errors.contract_value && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.contract_value[0]}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="total_budget"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Total Budget
                  </label>
                  <CurrencyInput
                    id="total_budget"
                    name="total_budget"
                    placeholder="Rp 0"
                    value={formData.total_budget}
                    decimalsLimit={2}
                    prefix="Rp "
                    groupSeparator="."
                    decimalSeparator=","
                    onValueChange={(value, name) =>
                      handleCurrencyChange(value, name)
                    }
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.total_budget && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.total_budget[0]}
                    </p>
                  )}
                </div>
              </>
            )}
            {/* ))} */}

            <div className="lg:col-span-3">
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Lokasi
              </label>
              <textarea
                id="location"
                name="location"
                rows="3"
                value={formData.location}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>

            <div>
              <label
                htmlFor="latitude"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Latitude
              </label>
              <input
                id="latitude"
                name="latitude"
                type="text"
                value={formData.latitude}
                onChange={handleChange}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="longitude"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Longitude
              </label>
              <input
                id="longitude"
                name="longitude"
                type="text"
                value={formData.longitude}
                onChange={handleChange}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pilih Lokasi Proyek di Peta
              </label>
              <MapPicker
                position={mapPosition}
                onPositionChange={handleMapPositionChange}
              />
            </div>

            {hasFullAccess && (
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Status
                </label>
                <select
                  name="status"
                  id="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                >
                  {ProjectStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                {errors.status && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.status[0]}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4 mt-6 pt-6">
            <button
              type="button"
              onClick={() => navigate("/projects")}
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg"
            >
              Kembali
            </button>

            {hasFullAccess && (
              <button
                type="submit"
                disabled={loading}
                className="bg-[#2196F3] text-white px-6 py-2 rounded-lg disabled:bg-gray-400"
              >
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Tabel untuk menampilkan dan mengelola anggota tim */}
      <Suspense fallback={<ProjectTeamSkeleton />}>
        <ProjectTeamSection />
      </Suspense>
      {/* <ProjectTeamTable
        team={team}
        isLoading={isLoadingTeam}
        onDataUpdate={refreshTeam}
      /> */}

      {/* Tabel untuk menampilkan uraian pekerjaan */}
      <ProjectWorkItemsTable
        workItems={workItems}
        isLoading={isLoadingWorkItems}
        onDataUpdate={refreshWorkItems}
        userRole={userRole}
      />

      {/* Sementara di hide */}
      {/* Tabel untuk biaya lain-lain */}
      {/* <ProjectExpensesTable
        expenses={expenses}
        isLoading={isLoadingExpenses}
        onDataUpdate={refreshExpenses}
      /> */}

      {/* Tabel untuk alat */}
      <ProjectToolRequisitionsTable
        requisitions={toolRequisitions}
        isLoading={isLoadingToolRequisitions}
        onDataUpdate={refreshToolRequisitions}
      />

      {/* Tabel untuk material */}
      <ProjectMaterialRequisitionsTable
        requisitions={materialRequisitions}
        isLoading={isLoadingMaterialRequisitions}
        onDataUpdate={refreshMaterialRequisitions}
      />

      {/* Tabel untuk kendaraan dan alat berat */}
      <ProjectVehicleAssignmentsTable
        assignments={assignments}
        isLoading={isLoadingAssignments}
        onDataUpdate={refreshVehicles}
      />

      {/* Tabel untuk menampilkan laporan harian */}
      <DailyReportsTable
        reports={reports}
        isLoading={isLoadingReports}
        onDataUpdate={refreshReports}
        projectId={projectId}
      />
    </div>
  );
};

export default ProjectDetailPage;
