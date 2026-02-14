import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Plus, RotateCcw, List, FileText, FileCheck } from "lucide-react";
import { useAuthStore } from "../../../store/authStore";
import AddVehicleRequestForm from "./AddVehicleRequestForm";
import ReturnVehicleForm from "../../vehicles/components/ReturnVehicleForm";
import { updateVehicleAssignment } from "../../vehicles/api";
import api from "../../../api";
import Swal from "sweetalert2";

const ProjectVehicleAssignmentsTable = ({
  assignments = [],
  isLoading,
  onDataUpdate,
}) => {
  const navigate = useNavigate();
  const { id: projectId } = useParams();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [showReturnFormFor, setShowReturnFormFor] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [downloadingSuratJalanId, setDownloadingSuratJalanId] = useState(null);
  const [downloadingReturnId, setDownloadingReturnId] = useState(null);

  const user = useAuthStore((state) => state.user);
  const firstRole = user?.roles?.[0];
  const userRole =
    (typeof firstRole === "object" ? firstRole.name : firstRole) || "Guest";

  const hasFullAccess = ["Project Manager", "Admin", "Super Admin"].includes(
    userRole
  );

  const handleFormSuccess = () => {
    setIsFormVisible(false);
    if (onDataUpdate) {
      onDataUpdate();
    }
  };

  const handleDownloadSuratJalan = async (assignment) => {
    if (!assignment.vehicle_requisition_id) {
      Swal.fire(
        "Info",
        "Data penugasan ini tidak memiliki referensi Surat Jalan.",
        "info"
      );
      return;
    }

    setDownloadingSuratJalanId(assignment.id);
    try {
      const reqId = assignment.vehicle_requisition_id;

      const response = await api.get(
        `/v1/vehicle-requisitions/${reqId}/export`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      const contentDisposition = response.headers["content-disposition"];
      let fileName = `Surat_Jalan_Assignment_${assignment.id}.pdf`;

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
      console.error("Gagal download Surat Jalan", error);
      Swal.fire("Gagal", "Tidak dapat mengunduh Surat Jalan.", "error");
    } finally {
      setDownloadingSuratJalanId(null);
    }
  };

  const handleDownloadReturnReceipt = async (assignment) => {
    setDownloadingReturnId(assignment.id);
    try {
      const reqId = assignment.vehicle_requisition_id;

      const response = await api.get(
        `/v1/vehicle-assignments/${assignment.id}/export`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      const contentDisposition = response.headers["content-disposition"];
      let fileName = `Berita_Acara_Pengembalian_${assignment.id}.pdf`;

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
      console.error("Gagal download Berita Acara Pengembalian", error);
      Swal.fire("Gagal", "Tidak dapat mengunduh Surat Jalan.", "error");
    } finally {
      setDownloadingReturnId(null);
    }
  };

  const handleReturn = async (formData) => {
    if (!showReturnFormFor) return;

    setIsSubmitting(true);
    try {
      await updateVehicleAssignment(showReturnFormFor.id, formData);
      setShowReturnFormFor(null);
      onDataUpdate();
      Swal.fire({
        title: "Berhasil!",
        text: "Kendaraan telah dikembalikan. Dokumen Berita Acara dapat diunduh melalui tabel.",
        icon: "success",
        timer: 2500,
        showConfirmButton: false,
        position: "center",
      });
    } catch (error) {
      console.error("Gagal mengembalikan kendaraan", error);
      Swal.fire({
        title: "Gagal",
        text: "Terjadi kesalahan saat menyimpan data pengembalian.",
        icon: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading)
    return <div className="text-gray-500">Loading data kendaraan...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Kendaraan & Alat Berat
        </h3>

        {hasFullAccess && (
          <div className="flex items-center gap-4">
            <Link
              to={`/projects/${projectId}/vehicle-requisitions`}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              <List size={16} />
              Lihat Permintaan
            </Link>
            <button
              onClick={() => setIsFormVisible(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-blue-700"
            >
              <Plus size={16} /> Tambah Permintaan
            </button>
          </div>
        )}
      </div>

      {isFormVisible && (
        <AddVehicleRequestForm
          projectId={projectId}
          onSuccess={handleFormSuccess}
          onCancel={() => setIsFormVisible(false)}
        />
      )}

      {showReturnFormFor && (
        <ReturnVehicleForm
          onSave={handleReturn}
          onCancel={() => setShowReturnFormFor(null)}
          isLoading={isSubmitting}
          startOdometer={showReturnFormFor.start_odometer || 0}
        />
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                Nama Kendaraan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                Driver/Operator
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                Tanggal Mulai
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {assignments.length > 0 ? (
              assignments.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-3 text-sm text-gray-600">
                    <Link
                      to={`/vehicles/${item.vehicle.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {item.vehicle.name}
                    </Link>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600">
                    {item.driver?.name || "-"}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600">
                    {new Date(item.start_datetime).toLocaleDateString("id-ID")}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        item.end_datetime
                          ? "bg-gray-200"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {item.end_datetime
                        ? "Telah Dikembalikan"
                        : "Aktif Digunakan"}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600 text-right">
                    <button
                      onClick={() => handleDownloadSuratJalan(item)}
                      disabled={downloadingSuratJalanId === item.id}
                      className="text-gray-500 hover:text-blue-600 transition-colors p-1"
                      title="Download Surat Jalan PDF"
                    >
                      {downloadingSuratJalanId === item.id ? (
                        <span className="text-xs">...</span>
                      ) : (
                        <FileText size={18} />
                      )}
                    </button>

                    {item.end_datetime && (
                      <button
                        onClick={() => handleDownloadReturnReceipt(item)}
                        disabled={downloadingReturnId === item.id}
                        className="text-green-600 hover:text-green-800 transition-colors p-1 ml-1"
                        title="Download Berita Acara Pengembalian"
                      >
                        {downloadingReturnId === item.id ? (
                          <span className="text-xs">...</span>
                        ) : (
                          <FileCheck size={18} />
                        )}
                      </button>
                    )}

                    {!item.end_datetime && (
                      <button
                        onClick={() => setShowReturnFormFor(item)}
                        className="text-green-600 hover:text-green-800 font-medium flex items-center gap-1.5 ml-auto"
                      >
                        <RotateCcw size={14} /> Kembalikan
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-8 text-gray-500">
                  Belum ada kendaraan yang ditugaskan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectVehicleAssignmentsTable;
