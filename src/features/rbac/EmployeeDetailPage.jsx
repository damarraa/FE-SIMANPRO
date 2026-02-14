import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Activity,
  Briefcase,
  Building,
  Smartphone,
  CreditCard,
  User,
  CalendarClock,
} from "lucide-react";
import { userManagementApi } from "../../services/userManagementService";
import { getImageUrl } from "../../utils/image";
import Swal from "sweetalert2";

const EmployeeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const response = await userManagementApi.getEmployeeDetail(id);
        const userData = response.data.data ? response.data.data : response.data;
        setEmployee(userData);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Gagal Memuat Data",
          text: "Data karyawan tidak ditemukan atau terjadi kesalahan.",
          confirmButtonText: "Kembali ke List",
        }).then(() => {
          navigate("/employees");
        });
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id, navigate]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading)
    return (
      <div className="p-8 text-center text-gray-500">Memuat profil...</div>
    );
  if (!employee) return null;

  return (
    <div className="w-full">
      {/* Header Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate("/employees")}
          className="flex items-center text-gray-600 hover:text-[#0D47A1] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Kembali ke List
        </button>
        <button
          onClick={() => navigate(`/employees/${id}/edit`)}
          className="flex items-center gap-2 bg-[#2196F3] text-white px-4 py-2 rounded-lg hover:bg-blue-600 shadow-sm transition-colors"
        >
          <Edit2 className="w-4 h-4" />
          Edit Profil
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* --- LEFT COLUMN: PROFILE CARD --- */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center h-fit">
          <div className="relative mb-4">
            <img
              src={getImageUrl(employee.profile_picture)}
              alt={employee.name}
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-50"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  employee.name
                )}&size=128&background=random`;
              }}
            />
            <div
              className={`absolute bottom-1 right-1 w-6 h-6 rounded-full border-2 border-white ${
                employee.is_active ? "bg-green-500" : "bg-red-500"
              }`}
              title={employee.is_active ? "User Aktif" : "Non-Aktif"}
            ></div>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-1">
            {employee.name}
          </h2>
          {/* Menampilkan Job Title & NIK */}
          <p className="text-[#0D47A1] font-medium text-sm mb-1">
            {employee.job_title || "Belum ada Jabatan"}
          </p>
          <p className="text-gray-500 text-xs mb-4">
            NIK: {employee.employee_id || "-"}
          </p>

          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {employee.roles && employee.roles.length > 0 ? (
              employee.roles.map((role, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  <Shield className="w-3 h-3 mr-1" /> {role}
                </span>
              ))
            ) : (
              <span className="text-gray-400 italic text-sm">
                No Role Assigned
              </span>
            )}
          </div>
        </div>

        {/* --- RIGHT COLUMN: DETAILS --- */}
        <div className="lg:col-span-2 space-y-6">
          {/* SECTION 1: EMPLOYMENT DATA (Kepegawaian) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-[#0D47A1] mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
              <Briefcase className="w-5 h-5" /> Data Kepegawaian
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="bg-blue-50 p-2 rounded-lg text-blue-600 mt-1">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Departemen
                  </p>
                  <p className="text-gray-900 font-medium mt-1">
                    {employee.department?.name || "-"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-50 p-2 rounded-lg text-blue-600 mt-1">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Lokasi Kantor
                  </p>
                  <p className="text-gray-900 font-medium mt-1">
                    {employee.office?.name || "-"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-50 p-2 rounded-lg text-blue-600 mt-1">
                  <CalendarClock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Tanggal Bergabung
                  </p>
                  <p className="text-gray-900 font-medium mt-1">
                    {formatDate(employee.join_date)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-50 p-2 rounded-lg text-green-600 mt-1">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Gaji Pokok
                  </p>
                  <p className="text-gray-900 font-bold mt-1">
                    {formatCurrency(employee.base_salary)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: PERSONAL & CONTACT (Pribadi) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-[#0D47A1] mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
              <User className="w-5 h-5" /> Informasi Pribadi
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="bg-gray-50 p-2 rounded-lg text-gray-600 mt-1">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Email
                  </p>
                  <p className="text-gray-900 font-medium mt-1">
                    {employee.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-gray-50 p-2 rounded-lg text-gray-600 mt-1">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Telepon
                  </p>
                  <p className="text-gray-900 font-medium mt-1">
                    {employee.phone || "-"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-gray-50 p-2 rounded-lg text-gray-600 mt-1">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Tanggal Lahir
                  </p>
                  <p className="text-gray-900 font-medium mt-1">
                    {formatDate(employee.birth_date)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 md:col-span-2">
                <div className="bg-gray-50 p-2 rounded-lg text-gray-600 mt-1">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Alamat Domisili
                  </p>
                  <p className="text-gray-900 font-medium mt-1">
                    {employee.address || "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: SYSTEM INFO (Device, Signature, etc) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-[#0D47A1] mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
              <Activity className="w-5 h-5" /> Informasi Sistem
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="bg-orange-50 p-2 rounded-lg text-orange-600 mt-1">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Device ID Terdaftar
                  </p>
                  <p className="text-gray-900 font-mono text-sm mt-1 break-all">
                    {employee.device_id || "Belum ada device terdaftar"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-green-50 p-2 rounded-lg text-green-600 mt-1">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Terakhir Aktif
                  </p>
                  <p className="text-gray-900 font-medium mt-1">
                    {employee.last_active_at
                      ? new Date(employee.last_active_at).toLocaleString(
                          "id-ID"
                        )
                      : "Belum pernah login"}
                  </p>
                </div>
              </div>

              {employee.signature && (
                <div className="md:col-span-2 mt-4">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Tanda Tangan Digital
                  </p>
                  <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-4 inline-block">
                    <img
                      src={getImageUrl(employee.signature)}
                      alt="Signature"
                      className="h-20 object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailPage;
