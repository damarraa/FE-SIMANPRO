import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { createMaintenanceLog } from "../api";
import MaintenanceLogForm from "./MaintenanceLogForm";
import { Plus } from "lucide-react";
import Swal from "sweetalert2";

const MaintenanceLogsTable = ({ logs = [], isLoading, onDataUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id: vehicleId } = useParams();

  const handleSave = async (data) => {
    setIsSubmitting(true);
    try {
      const dataToSubmit = { ...data, vehicle_id: vehicleId };
      await createMaintenanceLog(dataToSubmit);

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Log servis berhasil ditambahkan.",
        showConfirmButton: false,
        timer: 1500,
      });

      setShowForm(false);
      onDataUpdate();
    } catch (error) {
      console.error("Gagal menyimpan log servis", error);
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Gagal menyimpan log servis.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Histori Servis</h3>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
        >
          <Plus size={16} />
          Tambah Log Servis
        </button>
      </div>

      {/* Tampilkan form jika showForm true */}
      {showForm && (
        <MaintenanceLogForm
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
          isLoading={isSubmitting}
        />
      )}

      {isLoading && <p>Loading histori servis...</p>}

      {!isLoading && logs.length === 0 && (
        <div className="text-center text-gray-500 py-4 bg-white rounded-xl shadow-sm">
          Belum ada histori servis.
        </div>
      )}

      {!isLoading && logs.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Tipe
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Lokasi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Odometer
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {logs.map((log) => (
                <tr key={log.id}>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(log.maintenance_date).toLocaleDateString("id-ID")}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {log.type}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {log.location}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {log.odometer}
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

export default MaintenanceLogsTable;
