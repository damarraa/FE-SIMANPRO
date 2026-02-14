import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { createVehicleAssignment, updateVehicleAssignment } from "../api";
import VehicleAssignmentForm from "./VehicleAssignmentForm";
import ReturnVehicleForm from "./ReturnVehicleForm";
import { Plus } from "lucide-react";
import Swal from "sweetalert2";

const VehicleAssignmentsHistory = ({
  assignments = [],
  isLoading,
  onDataUpdate,
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showReturnFormFor, setShowReturnFormFor] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id: vehicleId } = useParams();

  const handleSave = async (data) => {
    setIsSubmitting(true);
    try {
      await createVehicleAssignment(vehicleId, data);

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Kendaraan berhasil ditugaskan.",
        showConfirmButton: false,
        timer: 1500,
      });

      setShowCreateForm(false);
      onDataUpdate();
    } catch (error) {
      //   console.error("Gagal menyimpan penugasan", error);
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Gagal menyimpan data penugasan.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReturn = async (formData) => {
    setIsSubmitting(true);
    try {
      await updateVehicleAssignment(showReturnFormFor.id, formData);

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Kendaraan berhasil dikembalikan.",
        showConfirmButton: false,
        timer: 1500,
      });

      setShowReturnFormFor(null);
      onDataUpdate();
    } catch (error) {
      //   console.error("Gagal mengembalikan kendaraan", error);
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Gagal memproses pengembalian kendaraan.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <p className="text-gray-500 text-center py-4">Loading histori penugasan...</p>;

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Histori Penugasan Proyek
        </h3>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
        >
          <Plus size={16} />
          Tugaskan Kendaraan
        </button>
      </div>

      {showCreateForm && (
        <VehicleAssignmentForm
          onSave={handleSave}
          onCancel={() => setShowCreateForm(false)}
          isLoading={isSubmitting}
        />
      )}

      {showReturnFormFor && (
        <ReturnVehicleForm
          onSave={handleReturn}
          onCancel={() => setShowReturnFormFor(null)}
          isLoading={isSubmitting}
          startOdometer={showReturnFormFor.start_odometer}
        />
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">
                Proyek
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">
                Driver/Operator
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">
                Tanggal Mulai
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">
                Tanggal Selesai
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-700">
                Aksi
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
                    {item.project.job_name}
                  </Link>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {item.driver?.name || "-"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(item.start_datetime).toLocaleDateString("id-ID")}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {item.end_datetime
                    ? new Date(item.end_datetime).toLocaleDateString("id-ID")
                    : "-"}
                </td>
                <td className="px-6 py-4 text-right">
                  {!item.end_datetime && (
                    <button
                      onClick={() => setShowReturnFormFor(item)}
                      className="text-green-600 hover:underline text-sm font-medium"
                    >
                      Kembalikan
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VehicleAssignmentsHistory;
