import React, { useEffect, useState } from "react";
import api from "../../api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import {
  Wrench,
  Download,
  FileText,
  RotateCcw,
  CheckCircle,
  XCircle,
} from "lucide-react";
import useToolRequisitionDetail from "./hooks/useToolRequisitionDetail";
import IssueToolModal from "./components/IssueToolModal";
import ReturnToolModal from "./components/ReturnToolModal";

const ToolRequisitionDetailPage = () => {
  const navigate = useNavigate();
  const { requisition, isLoading, update } = useToolRequisitionDetail();

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const [isIssueFormVisible, setIsIssueFormVisible] = useState(false);
  const [isReturnFormVisible, setIsReturnFormVisible] = useState(false);

  useEffect(() => {
    if (requisition) {
      setStatus(requisition.status);
    }
  }, [requisition]);

  const user = useAuthStore((state) => state.user);
  const firstRole = user?.roles?.[0];
  const userRole =
    (typeof firstRole === "object" ? firstRole.name : firstRole) || "Guest";

  // Debugging
  // console.log("userRole saat ini adalah ", userRole);
  const hasFullAccess = ["Admin", "Logistic", "Super Admin"].includes(userRole);

  const handleRefreshData = () => {
    window.location.reload();
  };

  const handleReject = async () => {
    const result = await Swal.fire({
      title: "Tolak Permintaan?",
      text: "Permintaan akan ditolak dan tidak dapat diproses lagi.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Tolak!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await api.put(`/v1/tool-requisitions/${requisition.id}`, {
          status: "Rejected",
        });
        Swal.fire("Ditolak!", "Permintaan telah ditolak.", "success");
        handleRefreshData();
      } catch (error) {
        Swal.fire("Gagal", "Gagal menolak permintaan.", "error");
      }
    }
  };

  const handleStatusUpdate = async () => {
    setLoading(true);
    try {
      await update({ status: status });
      Swal.fire({
        title: "Berhasil",
        text: "Status berhasil diperbarui.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Gagal update status peminjaman alat", error);
      Swal.fire("Gagal", "Terjadi kesalahan saat update status", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!requisition) return;
    setIsDownloading(true);
    try {
      const projectId = requisition.project?.id || requisition.project_id;
      const reqId = requisition.id;

      const response = await api.get(
        `/v1/projects/${projectId}/tool-requisitions/${reqId}/export`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      const contentDisposition = response.headers["content-disposition"];
      let fileName = `Permintaan_Alat_${requisition.tr_number}.pdf`;

      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (fileNameMatch && fileNameMatch.length === 2)
          fileName = fileNameMatch[1];
      }

      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();

      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Gagal download PDF", error);
      Swal.fire("Gagal", "Tidak dapat mengunduh file PDF.", "error");
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading)
    return <div className="p-8 text-center text-gray-500">Loading data...</div>;

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold text-[#0D47A1] flex items-center gap-2">
          <Wrench className="w-6 h-6" />
          Detail Permintaan Alat: {requisition?.tr_number}
        </h1>

        <button
          onClick={handleDownloadPdf}
          disabled={isDownloading}
          className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-70"
        >
          {isDownloading ? (
            <span className="text-sm">Downloading...</span>
          ) : (
            <>
              <Download size={18} />
              <span className="text-sm font-medium">Export PDF</span>
            </>
          )}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="">
            <label className="text-sm text-gray-500">Proyek</label>
            <p className="font-semibold text-gray-800">
              {requisition?.project?.name}
            </p>
          </div>

          <div className="">
            <label className="text-sm text-gray-500">Tanggal Permintaan</label>
            <p className="font-semibold text-gray-800">
              {new Date(requisition?.request_date).toLocaleDateString("id-ID")}
            </p>
          </div>

          <div className="">
            <label className="text-sm text-gray-500">Status Saat Ini</label>
            <span
              className={`inline-block px-2 py-1 rounded text-sm font-semibold 
              ${
                requisition?.status === "Pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : ""
              }
              ${
                requisition?.status === "Approved"
                  ? "bg-blue-100 text-blue-800"
                  : ""
              }
              ${
                requisition?.status === "Rejected"
                  ? "bg-red-100 text-red-800"
                  : ""
              }
              ${
                requisition?.status === "Issued"
                  ? "bg-green-100 text-green-800"
                  : ""
              }
            `}
            >
              {requisition?.status}
            </span>
          </div>

          <div className="">
            <label className="text-sm text-gray-500">Diminta Oleh</label>
            <p className="font-semibold text-gray-800">
              {requisition?.requester?.name}
            </p>
          </div>

          <div className="">
            <label className="text-sm text-gray-500">Catatan</label>
            <p className="font-semibold text-gray-800">
              {requisition?.notes || "-"}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-500">
          <FileText size={20} /> Rincian Alat
        </h3>
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-gray-500">Alat</th>
              <th className="px-6 py-3 text-left text-gray-500">Kode</th>
              <th className="px-6 py-3 text-left text-gray-500">
                Kuantitas Diminta
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {requisition?.items?.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 text-left text-gray-800">
                  {item.tool?.name}
                </td>
                <td className="px-6 py-4 text-left text-gray-800">
                  {item.tool?.tool_code}
                </td>
                <td className="px-6 py-4 text-left text-gray-800">
                  {item.quantity_requested}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* {canUpdateStatus && (
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <h3 className="text-lg font-semibold mb-4 text-gray-500">
            Ubah Status
          </h3>
          <div className="flex items-center gap-4">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              defaultValue={requisition?.status}
              className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Issued">Issued (Tugaskan Alat)</option>
              <option value="Returned">Returned (Alat Kembali)</option>
            </select>
            <button
              onClick={handleStatusUpdate}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              {loading ? "Menyimpan..." : "Update Status"}
            </button>
          </div>
        </div>
      )} */}

      {hasFullAccess && (
        <div className="bg-white rounded-xl shadow-sm p-6 border animate-fade-in-up">
          <h3 className="text-lg font-semibold mb-4 text-gray-500">
            Tindakan Logistik
          </h3>

          {/* RENDER FORM ISSUE SECARA INLINE */}
          {isIssueFormVisible && (
            <div className="mb-6">
              <IssueToolModal
                requisitionId={requisition.id}
                onClose={() => setIsIssueFormVisible(false)}
                onSuccess={handleRefreshData}
              />
            </div>
          )}

          {/* RENDER FORM RETURN SECARA INLINE */}
          {isReturnFormVisible && (
            <div className="mb-6">
              <ReturnToolModal
                requisitionId={requisition.id}
                onClose={() => setIsReturnFormVisible(false)}
                onSuccess={handleRefreshData}
              />
            </div>
          )}

          {/* TOMBOL AKSI (Hanya muncul jika Form sedang TIDAK aktif) */}
          {!isIssueFormVisible && !isReturnFormVisible && (
            <div className="flex flex-wrap items-center gap-4">
              {requisition?.status === "Pending" && (
                <>
                  <button
                    onClick={() => setIsIssueFormVisible(true)}
                    className="bg-green-600 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors shadow-sm font-medium"
                  >
                    <CheckCircle size={18} />
                    Approve & Issue (Keluarkan Barang)
                  </button>

                  <button
                    onClick={handleReject}
                    className="bg-red-50 text-red-600 border border-red-200 px-6 py-2.5 rounded-lg flex items-center gap-2 hover:bg-red-100 transition-colors font-medium"
                  >
                    <XCircle size={18} />
                    Tolak
                  </button>
                </>
              )}

              {requisition?.status === "Issued" && (
                <button
                  onClick={() => setIsReturnFormVisible(true)}
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm font-medium"
                >
                  <RotateCcw size={18} />
                  Proses Pengembalian (Return)
                </button>
              )}

              {(requisition?.status === "Returned" ||
                requisition?.status === "Rejected") && (
                <div className="text-gray-500 italic flex items-center gap-2">
                  <CheckCircle size={16} />
                  Proses telah selesai. Tidak ada tindakan lanjutan.
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ToolRequisitionDetailPage;
