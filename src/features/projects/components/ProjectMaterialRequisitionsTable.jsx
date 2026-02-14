import React, { useState } from "react";
import { Plus, Edit, Trash2, List, FileText } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import AddMaterialRequestForm from "./AddMaterialRequestForm";
import { useAuthStore } from "../../../store/authStore";

const StatusBadge = ({ status }) => {
  const color = {
    Pending: "bg-yellow-100 text-yellow-800",
    Approved: "bg-blue-100 text-blue-800",
    Issued: "bg-green-100 text-green-800",
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

const ProjectMaterialRequisitionsTable = ({
  requisitions = [],
  isLoading,
  onDataUpdate,
}) => {
  const { id: projectId } = useParams();
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleFormSuccess = () => {
    setIsFormVisible(false);
    onDataUpdate();
  };

  const user = useAuthStore((state) => state.user);
  const firstRole = user?.roles?.[0];
  const userRole =
    (typeof firstRole === "object" ? firstRole.name : firstRole) || "Guest";

  const hasFullAccess = ["Project Manager", "Admin", "Super Admin"].includes(
    userRole
  );

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Permintaan Material
        </h3>

        {hasFullAccess && (
          <div className="flex items-center gap-4">
            <Link
              to={`/material-requisitions?projectId=${projectId}`}
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
        <AddMaterialRequestForm
          projectId={projectId}
          onSuccess={handleFormSuccess}
          onCancel={() => setIsFormVisible(false)}
        />
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                Nama Material
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
                    {item.items && item.items.length > 0 ? (
                      <ul className="list-disc list-inside space-y-1">
                        {item.items.map((reqItem) => (
                          <li key={reqItem.id}>
                            {reqItem.material?.name} (
                            {reqItem.quantity_requested} {reqItem.material.unit}
                            )
                          </li>
                        ))}
                      </ul>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-6 py-3 text-left text-sm text-gray-600">
                    {new Date(item.request_date).toLocaleDateString("id-ID")}
                  </td>
                  <td className="px-6 py-3 text-left text-sm text-gray-600">
                    {item.requester
                      ? item.requester.name
                      : item.requested_by_id || "-"}
                    {/* {item.requested_by || "-"} */}
                  </td>
                  <td className="px-6 py-3 text-left text-sm text-gray-600">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-6 py-3 text-right text-sm text-gray-600">
                    <div className="flex justify-end items-center hap-3">
                      {item.pdf_url && (
                        <a
                          href={item.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-red-600 transition-colors"
                          title="Download PDF"
                        >
                          <FileText size={18} />
                        </a>
                      )}
                    </div>
                    <Link
                      to={`/material-requisitions/${item.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Detail
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-500">
                  Belum ada permintaan material.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectMaterialRequisitionsTable;
