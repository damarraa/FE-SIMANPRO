import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Plus, List, FileText, RotateCcw, Eye } from "lucide-react";
import AddToolRequestForm from "./AddToolRequestForm";
import ReturnToolModal from "../../tool-requisitions/components/ReturnToolModal";
import { useAuthStore } from "../../../store/authStore";
import api from "../../../api";
import Swal from "sweetalert2";

const StatusBadge = ({ status }) => {
  const color = {
    Pending: "bg-yellow-100 text-yellow-800",
    Approved: "bg-blue-1oo text-blue-800",
    Issued: "bg-green-100 text-green-800",
    Returned: "bg-gray-100 text-gray-800",
    Rejected: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`px-2 py-1 text-xs rounded-full font-medium ${
        color[status] || "bg-gray-100"
      }`}
    >
      {status}
    </span>
  );
};

const ProjectToolRequisitionsTable = ({
  requisitions = [],
  isLoading,
  onDataUpdate,
}) => {
  const { id: projectId } = useParams();
  const [isFormVisible, setIsFormVisible] = useState(false);

  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [selectedReqId, setSelectedReqId] = useState(null);

  const [downloadingPdfId, setDownloadingPdfId] = useState(null);

  const handleFormSuccess = () => {
    setIsFormVisible(false);
    if (onDataUpdate) onDataUpdate();
  };

  const handleReturnSuccess = () => {
    if (onDataUpdate) onDataUpdate();
  };

  const user = useAuthStore((state) => state.user);
  const firstRole = user?.roles?.[0];
  const userRole =
    (typeof firstRole === "object" ? firstRole.name : firstRole) || "Guest";

  const hasFullAccess = [
    "Project Manager",
    "Admin",
    "Logistic",
    "Super Admin",
  ].includes(userRole);

  const openReturnModal = (reqId) => {
    setSelectedReqId(reqId);
    setReturnModalOpen(true);
  };

  const handleDownloadPdf = async (requisition) => {
    setDownloadingPdfId(requisition.id);
    try {
      const response = await api.get(
        `/v1/projects/${projectId}/tool-requisitions/${requisition.id}/export`,
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
      setDownloadingPdfId(null);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Permintaan Alat</h3>

        {hasFullAccess && (
          <div className="flex items-center gap-4">
            <Link
              to={`/tool-requisitions?projectId=${projectId}`}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              <List size={16} />
              Lihat Permintaan
            </Link>

            <button
              onClick={() => setIsFormVisible(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-blue-700"
            >
              <Plus size={16} />
              Tambah Permintaan
            </button>
          </div>
        )}
      </div>

      {isFormVisible && (
        <AddToolRequestForm
          projectId={projectId}
          onSuccess={handleFormSuccess}
          onCancel={() => setIsFormVisible(false)}
        />
      )}

      {returnModalOpen && selectedReqId && (
        <ReturnToolModal
          requisitionId={selectedReqId}
          onClose={() => setReturnModalOpen(false)}
          onSuccess={handleReturnSuccess}
        />
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                Nama Alat
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                Tanggal Permintaan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                Diminta Oleh
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
            {isLoading ? (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-500">
                  Memuat data...
                </td>
              </tr>
            ) : requisitions.length > 0 ? (
              requisitions.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-3 text-left text-sm text-gray-600">
                    <ul className="list-disc list-inside space-y-1">
                      {item.items?.map((reqItem) => (
                        <li key={reqItem.id}>
                          {reqItem.tool?.name} ({reqItem.quantity_requested})
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-6 py-3 text-left text-sm text-gray-600">
                    {new Date(item.request_date).toLocaleDateString("id-ID")}
                  </td>
                  <td className="px-6 py-3 text-left text-sm text-gray-600">
                    {item.requester
                      ? item.requester.name
                      : item.requested_by_id || "-"}
                  </td>
                  <td className="px-6 py-3 text-left text-sm text-gray-600">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-6 py-3 text-right text-sm text-gray-600">
                    <div className="flex justify-end items-center gap-3">
                      <button
                        onClick={() => handleDownloadPdf(item)}
                        disabled={downloadingPdfId === item.id}
                        className="text-gray-500 hover:text-blue-600 transition-colors p-1 mr-2"
                        title="Download PDF Permintaan"
                      >
                        {downloadingPdfId === item.id ? (
                          <span className="text-xs">...</span>
                        ) : (
                          <FileText size={18} />
                        )}
                      </button>

                      <Link
                        to={`/tool-requisitions/${item.id}`}
                        className="text-blue-500 hover:text-blue-700 transition-colors p-1 mr-2"
                        title="Lihat Detail"
                      >
                        <Eye size={18} />
                      </Link>

                      {/* Tombol Return (Logic & Style mirip Vehicle) */}
                      {item.status === "Issued" && hasFullAccess && (
                        <button
                          onClick={() => openReturnModal(item.id)}
                          className="text-green-600 hover:text-green-800 font-medium flex items-center gap-1.5 ml-2"
                        >
                          <RotateCcw size={14} /> Kembalikan
                        </button>
                      )}
                    </div>
                    {/* <Link
                      to={`/tool-requisitions/${item.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Detail
                    </Link> */}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-8 text-gray-500">
                  Belum ada permintaan alat.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectToolRequisitionsTable;
