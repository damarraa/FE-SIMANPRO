import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  User,
  FileCheck,
  XCircle,
  CheckCircle,
  Printer,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import useLeaveRequests from "./hooks/useLeaveRequest";
import Swal from "sweetalert2";

const STORAGE_URL =
  import.meta.env.VITE_ASSET_BASE_URL ||
  "https://be.simanpro.prisan.co.id/storage/";

const LeaveDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { leaveDetail, isLoading, fetchDetail, processApproval, downloadPdf } =
    useLeaveRequests();

  const [isExporting, setIsExporting] = useState(false);
  const user = useAuthStore((state) => state.user);
  const firstRole = user?.roles?.[0];
  const userRole =
    (typeof firstRole === "object" ? firstRole.name : firstRole) || "Guest";

  const canApprove = ["Admin", "Super Admin", "HR"].includes(userRole);

  useEffect(() => {
    if (id) fetchDetail(id);
  }, [id, fetchDetail]);

  const handleApprove = () => {
    Swal.fire({
      title: "Setujui Pengajuan?",
      text: "Pastikan data sudah sesuai.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Setujui",
      cancelButtonText: "Batal",
      confirmButtonColor: "#10B981",
    }).then((result) => {
      if (result.isConfirmed) {
        processApproval(id, "approved");
      }
    });
  };

  const handleReject = () => {
    Swal.fire({
      title: "Tolak Pengajuan",
      input: "textarea",
      inputLabel: "Alasan Penolakan",
      inputPlaceholder: "Tuliskan alasan penolakan disini...",
      showCancelButton: true,
      confirmButtonText: "Tolak",
      confirmButtonColor: "#EF4444",
      inputValidator: (value) => {
        if (!value) return "Anda harus menuliskan alasan!";
      },
    }).then((result) => {
      if (result.isConfirmed) {
        processApproval(id, "rejected", result.value);
      }
    });
  };

  const handleExportPdf = async () => {
    setIsExporting(true);
    const fileName = leaveDetail?.user?.name
      ? `LEAVE-${leaveDetail.user.name}.pdf`
      : "LEAVE-EXPORT.pdf";
    await downloadPdf(id, fileName);

    setIsExporting(false);
  };

  if (isLoading)
    return <div className="p-8 text-center">Loading detail...</div>;
  if (!leaveDetail)
    return <div className="p-8 text-center">Data tidak ditemukan.</div>;

  const {
    user: requester,
    status,
    type,
    reason,
    start_date,
    end_date,
    days_count,
    attachment_path,
    rejection_reason,
  } = leaveDetail;

  const currentStatus = status ? status.toLowerCase() : "";

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-500 hover:text-blue-600 transition"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Daftar
      </button>

      <div className="flex justify-between items-start">
        <h1 className="text-2xl font-bold text-[#0D47A1]">Detail Pengajuan</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportPdf}
            disabled={isExporting}
            className={`flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 transition-colors bg-white shadow-sm ${
              isExporting ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
            }`}
          >
            {isExporting ? (
              <div className="animate-spin h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full" />
            ) : (
              <Printer className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">
              {isExporting ? "Downloading..." : "Export PDF"}
            </span>
          </button>

          <span
            className={`px-4 py-2 rounded-full text-sm font-bold capitalize border 
            ${
              status === "approved"
                ? "bg-green-50 text-green-700 border-green-200"
                : status === "rejected"
                ? "bg-red-50 text-red-700 border-red-200"
                : "bg-yellow-50 text-yellow-700 border-yellow-200"
            }`}
          >
            {status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm md:col-span-1 space-y-4 h-fit">
          <div className="flex items-center gap-3 border-b pb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              <User size={24} />
            </div>
            <div>
              <p className="font-bold text-gray-800">{requester?.name}</p>
              <p className="text-sm text-gray-500">
                {requester?.department?.name || "No Dept"}
              </p>
            </div>
          </div>
          <div className="text-sm space-y-2">
            <p>
              <span className="text-gray-500">NIP:</span>{" "}
              {requester?.employee_id || "-"}
            </p>
            <p>
              <span className="text-gray-500">Jabatan:</span>{" "}
              {requester?.job_title || "-"}
            </p>
            <p>
              <span className="text-gray-500">Bergabung pada:</span>{" "}
              {requester?.join_date || "-"}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm md:col-span-2 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider">
                Tipe Pengajuan
              </label>
              <p className="font-semibold text-lg capitalize flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-blue-500" /> {type}
              </p>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider">
                Durasi
              </label>
              <p className="font-semibold text-lg">{days_count} Hari</p>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider">
                Mulai Tanggal
              </label>
              <p className="font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />{" "}
                {new Date(start_date).toLocaleDateString()}
              </p>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider">
                Sampai Tanggal
              </label>
              <p className="font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />{" "}
                {new Date(end_date).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider">
              Alasan
            </label>
            <div className="mt-1 p-3 bg-gray-50 rounded-lg text-gray-700 italic border border-gray-100">
              "{reason}"
            </div>
          </div>

          {attachment_path && (
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">
                Lampiran Bukti
              </label>
              <div className="border rounded-lg overflow-hidden w-full max-w-xs">
                <a
                  href={`${STORAGE_URL}${attachment_path}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src={`${STORAGE_URL}${attachment_path}`}
                    alt="Lampiran"
                    className="w-full h-auto hover:opacity-90 transition cursor-zoom-in"
                  />
                </a>
              </div>
            </div>
          )}

          {status === "rejected" && rejection_reason && (
            <div className="bg-red-50 p-4 rounded-lg border border-red-100 text-red-800">
              <p className="font-bold text-sm">Alasan Penolakan:</p>
              <p>{rejection_reason}</p>
            </div>
          )}

          {currentStatus === "pending" && canApprove && (
            <div className="flex gap-4 pt-4 border-t mt-4">
              <button
                onClick={handleReject}
                className="flex-1 bg-white border border-red-200 text-red-600 py-3 rounded-lg hover:bg-red-50 font-medium flex items-center justify-center gap-2 transition"
              >
                <XCircle size={20} /> Tolak
              </button>
              <button
                onClick={handleApprove}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-medium flex items-center justify-center gap-2 shadow-lg transition"
              >
                <CheckCircle size={20} /> Setujui
              </button>
            </div>
          )}

          {currentStatus === "pending" && !canApprove && (
            <div className="mt-4 p-3 bg-blue-50 text-blue-800 text-sm rounded-lg text-center">
              Menunggu persetujuan Admin/HR.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveDetailPage;
