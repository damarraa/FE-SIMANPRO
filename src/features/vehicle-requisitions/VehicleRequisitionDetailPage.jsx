import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { Truck, Download, FileText } from "lucide-react";
import ProcessVehicleRequisitionForm from "./components/ProcessVehicleRequisitionForm";
import useVehicleRequisitionDetail from "./hooks/useVehicleRequisitionDetail";
import api from "../../api";
import Swal from "sweetalert2";

const VehicleRequisitionDetailPage = () => {
  const navigate = useNavigate();
  const { requisition, isLoading, update } = useVehicleRequisitionDetail();
  const { user } = useAuthStore();

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (requisition) {
      setStatus(requisition.status);
    }
  }, [requisition]);

  const handleProcessSuccess = () => {
    setIsProcessing(false);
    navigate("/vehicle-requisitions");
  };

  const canUpdateStatus = user?.roles?.some((role) =>
    ["Logistic", "Admin", "Super Admin"].includes(role)
  );

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
      console.error("Gagal update status", error);
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
        `/v1/vehicle-requisitions/${reqId}/export`,
        {
          responseType: "blob",
        }
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
        <h1 className="text-2xl font-bold text-[#0D47A1] mb-8 flex items-center gap-2">
          <Truck className="w-6 h-6" />
          Detail Permintaan Kendaraan: {requisition?.vr_number}
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

      {/* Ringkasan Info */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <label className="text-sm text-gray-500">Proyek</label>
            <p className="font-semibold text-gray-800">
              {requisition?.project?.job_name}
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Tanggal Permintaan</label>
            <p className="font-semibold text-gray-800">
              {new Date(requisition?.request_date).toLocaleDateString("id-ID")}
            </p>
          </div>
          <div>
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

          <div>
            <label className="text-sm text-gray-500">Diminta Oleh</label>
            <p className="font-semibold text-gray-800">
              {requisition?.requested_by?.name}
            </p>
          </div>

          <div>
            <label className="text-sm text-gray-500">Catatan</label>
            <p className="font-semibold text-gray-800">
              {requisition?.notes || "-"}
            </p>
          </div>
        </div>
      </div>

      {/* Tabel Rincian Kendaraan */}
      <div className="bg-white rounded-xl shadow-sm p-6 border mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-500">
          <FileText size={20} /> Rincian Kendaraan yang Diminta
        </h3>
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-gray-500">Kendaraan</th>
              <th className="px-6 py-3 text-left text-gray-500">No. Polisi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {requisition?.items?.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 text-gray-800">
                  {item.vehicle?.name}
                </td>
                <td className="px-6 py-4 text-gray-800">
                  {item.vehicle?.license_plate}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Logika Aksi yang Diperbarui */}
      {requisition?.status === "Pending" && canUpdateStatus && (
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Aksi Logistik
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Permintaan ini menunggu untuk diproses. Klik tombol di bawah untuk
            menugaskan kendaraan.
          </p>
          <button
            onClick={() => setIsProcessing(true)}
            className="bg-green-600 text-white px-6 py-2 rounded-lg"
          >
            Proses Permintaan & Tugaskan Kendaraan
          </button>
        </div>
      )}

      {isProcessing && (
        <ProcessVehicleRequisitionForm
          requisition={requisition}
          onSuccess={handleProcessSuccess}
          onCancel={() => setIsProcessing(false)}
        />
      )}
    </div>
  );
};

export default VehicleRequisitionDetailPage;
