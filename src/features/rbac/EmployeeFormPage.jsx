import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  UserPlus,
  Save,
  ArrowLeft,
  Lock,
  Briefcase,
  MapPin
} from "lucide-react";
import { userManagementApi } from "../../services/userManagementService";
import { rbacApi } from "../../services/rbacService";
import useOfficeLocations from "../office-locations/hooks/useOfficeLocations";
import useDepartments from "../department/hooks/useDepartments";
import Swal from "sweetalert2";
import CurrencyInput from "react-currency-input-field";

const EmployeeFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const { locationsData, fetchLocations } = useOfficeLocations();
  const { allDepartments, fetchAllDepartments } = useDepartments();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    is_active: true,
    phone: "",
    address: "",
    employee_id: "",
    job_title: "",
    join_date: "",
    birth_date: "",
    base_salary: "",
    office_id: "",
    department_id: "",
  });

  const [roleOptions, setRoleOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setInitialLoading(true);
        const [rolesRes] = await Promise.all([
          rbacApi.getRoles(),
          fetchLocations({ per_page: 100 }),
          fetchAllDepartments(),
        ]);
        const rolesData = rolesRes.data.data || rolesRes.data;
        setRoleOptions(Array.isArray(rolesData) ? rolesData : []);

        if (isEditMode) {
          const userRes = await userManagementApi.getEmployeeDetail(id);
          const userData = userRes.data.data || userRes.data;

          setFormData({
            name: userData.name || "",
            email: userData.email || "",
            password: "",
            role:
              userData.roles && userData.roles.length > 0
                ? userData.roles[0]
                : "",
            is_active: userData.is_active === 1 || userData.is_active === true,
            phone: userData.phone || "",
            address: userData.address || "",
            employee_id: userData.employee_id || "",
            job_title: userData.job_title || "",
            join_date: userData.join_date || "",
            birth_date: userData.birth_date || "",
            base_salary: userData.base_salary || 0,
            office_id: userData.office_id || "",
            department_id: userData.department_id || "",
          });
        }
      } catch (error) {
        console.error("Error loading data:", error);
        Swal.fire("Error", "Gagal memuat data awal.", "error");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchData();
  }, [id, isEditMode, fetchLocations, fetchAllDepartments]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSalaryChange = (value) => {
    setFormData((prev) => ({ ...prev, base_salary: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const payload = { ...formData };

      if (isEditMode && !payload.password) delete payload.password;

      if (payload.office_id) payload.office_id = parseInt(payload.office_id);
      if (payload.department_id)
        payload.department_id = parseInt(payload.department_id);

      if (isEditMode) {
        await userManagementApi.updateEmployee(id, payload);
      } else {
        await userManagementApi.createEmployee(formData);
      }

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: `Data karyawan berhasil ${
          isEditMode ? "diperbarui" : "disimpan"
        }.`,
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        navigate("/employees");
      });
    } catch (err) {
      if (err.response?.status === 422) {
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
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: "Terjadi kesalahan sistem. Silakan coba lagi.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading)
    return <div className="p-8 text-center text-gray-500">Loading form...</div>;

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold text-[#0D47A1] mb-8 flex items-center gap-2">
        <UserPlus className="w-6 h-6" />
        {isEditMode ? "Edit Karyawan & Role" : "Tambah Karyawan Baru"}
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="border-b border-gray-100 pb-2 mb-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <Lock className="w-4 h-4" /> Informasi Akun & Pribadi
            </h3>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Status Akun:</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                <span className="ml-3 text-sm font-medium text-gray-900">
                  {formData.is_active ? "Aktif" : "Non-Aktif"}
                </span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nama lengkap karyawan"
                required
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Contoh: karyawan@perusahaan.com"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password{" "}
                {isEditMode && (
                  <span className="text-gray-600 font-normal">
                    (Kosongkan jika tidak diubah)
                  </span>
                )}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder={isEditMode ? "••••••" : "Min. 8 karakter"}
                required={!isEditMode}
                minLength={8}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password[0]}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role / Jabatan System
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">-- Pilih Role Akses --</option>
                {roleOptions.map((role) => (
                  <option key={role.id} value={role.name}>
                    {role.name}
                  </option>
                ))}
              </select>
              {errors.role && (
                <p className="text-red-500 text-xs mt-1">{errors.role[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nomor Telepon
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Contoh: 081234567890"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Lahir
              </label>
              <input
                type="date"
                name="birth_date"
                value={formData.birth_date}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alamat Domisili
              </label>
              <textarea
                name="address"
                rows="2"
                value={formData.address}
                onChange={handleChange}
                placeholder="Masukkan alamat lengkap domisili karyawan..."
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: Data Kepegawaian (HR Info) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 border-l-4 border-l-blue-500">
          <div className="border-b border-gray-100 pb-2 mb-4">
            <h3 className="text-lg font-semibold text-[#0D47A1] flex items-center gap-2">
              <Briefcase className="w-5 h-5" /> Data Kepegawaian (HR)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nomor Induk Pegawai (NIP)
              </label>
              <input
                type="text"
                name="employee_id"
                value={formData.employee_id}
                onChange={handleChange}
                placeholder="Contoh: PAL-TAHUN MASUK-INDEX atau PAL-2026-001, dst..."
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Title (Posisi Kerja)
              </label>
              <input
                type="text"
                name="job_title"
                value={formData.job_title}
                onChange={handleChange}
                placeholder="Contoh: Senior Backend Engineer"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Bergabung
              </label>
              <input
                type="date"
                name="join_date"
                value={formData.join_date}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gaji Pokok
              </label>
              <CurrencyInput
                id="base_salary"
                name="base_salary"
                placeholder="Rp 0"
                value={formData.base_salary}
                decimalsLimit={0}
                prefix="Rp "
                groupSeparator="."
                decimalSeparator=","
                onValueChange={handleSalaryChange}
                className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lokasi Kantor Penempatan
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <select
                  name="office_id"
                  value={formData.office_id}
                  onChange={handleChange}
                  className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">-- Pilih Kantor --</option>
                  {locationsData.data.map((office) => (
                    <option key={office.id} value={office.id}>
                      {office.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Departemen
              </label>
              <select
                name="department_id"
                value={formData.department_id}
                onChange={handleChange}
                className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">-- Pilih Departemen --</option>
                {allDepartments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name} ({dept.code})
                  </option>
                ))}
              </select>
            </div>
            {errors.department_id && (
              <p className="text-red-500 text-xs mt-1">
                {errors.department_id[0]}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={() => navigate("/employees")}
            className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#2196F3] text-white px-6 py-2 rounded-lg disabled:bg-gray-400 hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-sm"
          >
            {loading ? (
              "Menyimpan..."
            ) : (
              <>
                <Save className="w-4 h-4" /> Simpan Data
              </>
            )}
          </button>
        </div>

        {/* <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 border-b border-gray-100 pb-2 mb-2 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-700">
              Informasi Dasar
            </h3>

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Status Akun:</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                <span className="ml-3 text-sm font-medium text-gray-900">
                  {formData.is_active ? "Aktif" : "Non-Aktif"}
                </span>
              </label>
            </div>
          </div>

          <div className="">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nama lengkap karyawan"
              required
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>
            )}
          </div>

          <div className="">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>
            )}
          </div>

          <div className="md:col-span-2 border-b border-gray-100 pb-2 mb-2 mt-4">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              Hak Akses Aplikasi
              <span className="text-xs font-normal text-white bg-blue-500 px-2 py-0.5 rounded-full">
                Penting
              </span>
            </h3>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role / Jabatan
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
              required
            >
              <option value="">-- Pilih Role --</option>
              {roleOptions.map((role) => (
                <option key={role.id} value={role.name}>
                  {role.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Role menentukan menu dan fitur apa saja yang bisa diakses oleh
              karyawan ini.
            </p>
            {errors.role && (
              <p className="text-red-500 text-xs mt-1">{errors.role[0]}</p>
            )}
          </div>

          <div className="md:col-span-2 border-b border-gray-100 pb-2 mb-2 mt-4">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <Lock className="w-4 h-4" /> Keamanan Akun
            </h3>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password{" "}
              {isEditMode && "(Biarkan kosong jika tidak ingin mengubah)"}
            </label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder={isEditMode ? "••••••" : "Masukkan password baru"}
              required={!isEditMode}
              minLength={8}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password[0]}</p>
            )}
          </div>

          <div className="md:col-span-2 flex justify-end gap-4 mt-6 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate("/employees")}
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#2196F3] text-white px-6 py-2 rounded-lg disabled:bg-gray-400 hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-sm"
            >
              {loading ? (
                "Menyimpan..."
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Simpan Data
                </>
              )}
            </button>
          </div>
        </div> */}
      </form>
    </div>
  );
};

export default EmployeeFormPage;
