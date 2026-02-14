import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { Briefcase } from "lucide-react";
import CurrencyInput from "react-currency-input-field";
import CreatableSelect from "react-select/creatable";
// Import Hooks
import useClientsList from "./hooks/useClientsList";
import useJobTypesList from "./hooks/useJobTypesList";
import useUsersByRole from "../../hooks/useUsersByRole";
import useWarehousesList from "../../hooks/useWarehousesList";
// Import Map Picker
import MapPicker from "../../Components/MapPicker";
import Swal from "sweetalert2";

const projectStatuses = ["On-Progress", "Completed", "Cancelled", "Pending"];

const ProjectCreatePage = () => {
  const navigate = useNavigate();

  const { clients, setClients, isLoading: isLoadingClients } = useClientsList();
  const {
    jobTypes,
    setJobTypes,
    isLoading: isLoadingJobTypes,
  } = useJobTypesList();
  const { users: projectManagers, isLoading: isLoadingPMs } =
    useUsersByRole("Project Manager");
  const {
    warehouses,
    setWarehouses,
    isLoading: isLoadingWarehouses,
  } = useWarehousesList();

  const [formData, setFormData] = useState({
    contract_num: "",
    job_name: "",
    start_date: "",
    end_date: "",
    location: "",
    latitude: "0.507067",
    longitude: "101.447779",
    contract_type: "",
    fund_source: "",
    contract_value: "",
    total_budget: "",
    status: "Pending",
    job_id: "",
    client_id: "",
    project_manager_id: "",
    default_warehouse_id: "",
  });

  const [selectedOptions, setSelectedOptions] = useState({
    jobType: null,
    client: null,
    warehouse: null,
  });

  const [isCreating, setIsCreating] = useState({
    jobType: false,
    client: false,
    warehouse: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const jobTypeOptions = useMemo(
    () => jobTypes.map((jt) => ({ value: jt.id, label: jt.name })),
    [jobTypes]
  );

  const clientOptions = useMemo(
    () => clients.map((c) => ({ value: c.id, label: c.name })),
    [clients]
  );

  const warehouseOptions = useMemo(
    () => warehouses.map((w) => ({ value: w.id, label: w.name })),
    [warehouses]
  );

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSelectChange = (selectedOption, actionMeta) => {
    const { name } = actionMeta;
    const keyMap = {
      job_id: "jobType",
      client_id: "client",
      default_warehouse_id: "warehouse",
    };

    setSelectedOptions((prev) => ({ ...prev, [keyMap[name]]: selectedOption }));
    setFormData((prev) => ({
      ...prev,
      [name]: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleCreateOption = async (
    name,
    endpoint,
    inputValue,
    fieldName,
    responseDataKey
  ) => {
    const keyMap = {
      job_id: "jobType",
      client_id: "client",
      default_warehouse_id: "warehouse",
    };
    const stateSetterMap = {
      job_id: setJobTypes,
      client_id: setClients,
      default_warehouse_id: setWarehouses,
    };

    setIsCreating((prev) => ({ ...prev, [keyMap[name]]: true }));
    try {
      const response = await api.post(endpoint, { [fieldName]: inputValue });
      const newItem = response.data.data;

      stateSetterMap[name]((prev) => [...prev, newItem]);

      const newOption = { value: newItem.id, label: newItem[responseDataKey] };
      setSelectedOptions((prev) => ({ ...prev, [keyMap[name]]: newOption }));
      setFormData((prev) => ({ ...prev, [name]: newItem.id }));
    } catch (error) {
      console.error(`Gagal membuat ${name} baru:`, error);
    } finally {
      setIsCreating((prev) => ({ ...prev, [keyMap[name]]: false }));
    }
  };

  const handleCurrencyChange = (value, name) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    setLoading(true);
    setErrors({});
    try {
      await api.post("/v1/projects", formData);
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Proyek baru berhasil dibuat!",
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold text-[#0D47A1] mb-8 flex items-center gap-2">
        <Briefcase className="w-6 h-6" />
        Tambah Proyek Baru
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
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
                onChange={handleChange}
                placeholder="Nama proyek"
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
                htmlFor="contract_num"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nomor Kontrak
              </label>
              <input
                id="contract_num"
                name="contract_num"
                onChange={handleChange}
                placeholder="Nomor kontrak"
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.contract_num && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.contract_num[0]}
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
              <CreatableSelect
                name="client_id"
                isClearable
                isLoading={isLoadingClients || isCreating.client}
                isDisabled={isLoadingClients || isCreating.client}
                options={clientOptions}
                value={selectedOptions.client}
                onChange={handleSelectChange}
                onCreateOption={(inputValue) =>
                  handleCreateOption(
                    "client_id",
                    "/v1/clients",
                    inputValue,
                    "client_name",
                    "client_name"
                  )
                }
                placeholder="Pilih atau ketik klien baru"
                className="text-gray-900"
                formatCreateLabel={(inputValue) =>
                  `Tambah klien baru: "${inputValue}"`
                }
              />
              {errors.client_id && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.client_id[0]}
                </p>
              )}
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
                onChange={handleChange}
                required
                disabled={isLoadingPMs}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Pilih Project Manager</option>
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
              <CreatableSelect
                name="job_id"
                isClearable
                isLoading={isLoadingJobTypes || isCreating.jobType}
                isDisabled={isLoadingJobTypes || isCreating.jobType}
                options={jobTypeOptions}
                value={selectedOptions.jobType}
                onChange={handleSelectChange}
                onCreateOption={(inputValue) =>
                  handleCreateOption(
                    "job_id",
                    "/v1/job-types",
                    inputValue,
                    "job_type",
                    "job_type"
                  )
                }
                placeholder="Pilih atau ketik kategori baru"
                className="text-gray-900"
                formatCreateLabel={(inputValue) =>
                  `Buat kategori baru: "${inputValue}"`
                }
              />
              {errors.job_id && (
                <p className="text-red-500 text-xs mt-1">{errors.job_id[0]}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="default_warehouse_id"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Gudang Default
              </label>
              <CreatableSelect
                name="default_warehouse_id"
                isClearable
                isLoading={isLoadingWarehouses || isCreating.warehouse}
                isDisabled={isLoadingWarehouses || isCreating.warehouse}
                options={warehouseOptions}
                value={selectedOptions.warehouse}
                onChange={handleSelectChange}
                onCreateOption={(inputValue) =>
                  handleCreateOption(
                    "default_warehouse_id",
                    "/v1/warehouses",
                    inputValue,
                    "warehouse_name",
                    "warehouse_name"
                  )
                }
                placeholder="Pilih atau ketik gudang baru"
                className="text-gray-900"
                formatCreateLabel={(inputValue) =>
                  `Tambah gudang baru: "${inputValue}"`
                }
              />
              {errors.default_warehouse_id && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.default_warehouse_id[0]}
                </p>
              )}
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
                onChange={handleChange}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

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
                onChange={handleChange}
                placeholder="Sumber dana"
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
                onChange={handleChange}
                placeholder="Tipe kontrak"
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
                defaultValue={0}
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
                defaultValue={0}
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
                onChange={handleChange}
                placeholder="Alamat lengkap"
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

            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status Proyek
              </label>
              <select
                name="status"
                id="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              >
                {projectStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              {errors.status && (
                <p className="text-red-500 text-xs mt-1">{errors.status[0]}</p>
              )}
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
          </div>

          <div className="flex justify-end gap-4 mt-6 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate("/projects")}
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#2196F3] text-white px-6 py-2 rounded-lg disabled:bg-gray-400"
            >
              {loading ? "Menyimpan..." : "Simpan Proyek"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProjectCreatePage;
