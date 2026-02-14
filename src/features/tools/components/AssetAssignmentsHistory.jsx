import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { createAssetAssignment } from "../api/assetAssignments";
import AssignmentForm from "./AssignmentForm";
import Swal from "sweetalert2";

const AssetAssignmentsHistory = ({
  assignments = [],
  isLoading,
  onDataUpdate,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id: toolId } = useParams();

  const handleSave = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        tool_id: toolId,
      };

      await createAssetAssignment(toolId, payload);
      setShowForm(false);
      onDataUpdate();

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Alat berhasil ditugaskan ke proyek.",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Gagal menyimpan penugasan", error);

      const errorMessage =
        error.response?.data?.message || "Gagal menyimpan data penugasan.";

      Swal.fire({
        icon: "error",
        title: "Gagal Menugaskan",
        text: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Histori Penugasan
        </h3>
        <button
          onClick={() => setShowForm(true)}
          className="bg-[#2196F3] hover:bg-blue-600 text-white font-medium px-6 py-2 rounded-lg disabled:bg-gray-400"
        >
          Tugaskan Alat
        </button>
      </div>

      {showForm && (
        <AssignmentForm
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
          isLoading={isSubmitting}
        />
      )}

      {isLoading && <p>Loading histori...</p>}

      {!isLoading && assignments.length === 0 && (
        <p className="text-center text-gray-500 py-4">
          Belum ada histori penugasan.
        </p>
      )}

      {!isLoading && assignments.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Proyek
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Tanggal Penugasan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Tanggal Kembali
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Ditugaskan Oleh
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {assignments.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    <Link
                      to={`/projects/${item.project.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {item.project.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(item.assigned_date).toLocaleDateString("id-ID")}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.returned_date
                      ? new Date(item.returned_date).toLocaleDateString("id-ID")
                      : "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.assigned_by.name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AssetAssignmentsHistory;
