import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useVehicleRequisitionDetail from "./hooks/useVehicleRequisitionDetail";
import { useAuthStore } from "../../store/authStore";
import { Truck } from "lucide-react";

const VehicleRequisitionDetailPage = () => {
  const navigate = useNavigate();
  const { requisition, isLoading, update } = useVehicleRequisitionDetail();
  const { user } = useAuthStore();

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const canUpdateStatus = user?.roles?.some((role) =>
    ["Logistic", "Admin", "Super Admin"].includes(role)
  );

  const handleStatusUpdate = async () => {
    setLoading(true);
    try {
      await update({ status: status });
    } catch (error) {
      console.error("Gagal update status", error);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold text-[#0D47A1] mb-8 flex items-center gap-2">
        <Truck className="w-6 h-6" />
        Detail Permintaan Kendaraan: {requisition?.vr_number}
      </h1>

      {/* Ringkasan Info */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm text-gray-500">Proyek</label>
            <p className="font-semibold text-gray-800">
              {requisition?.project?.name}
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
            <p className="font-semibold text-gray-800">{requisition?.status}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Diminta Oleh</label>
            <p className="font-semibold text-gray-800">
              {requisition?.requested_by}
            </p>
          </div>
        </div>
      </div>

      {/* Tabel Rincian Kendaraan */}
      <div className="bg-white rounded-xl shadow-sm p-6 border mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-500">
          Rincian Kendaraan yang Diminta
        </h3>
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-gray-500">Kendaraan</th>
              <th className="px-6 py-3 text-left text-gray-500">No. Polisi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {requisition?.items.map((item) => (
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

      {/* Aksi (hanya untuk role tertentu) */}
      {/* {canUpdateStatus && ( */}
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <h3 className="text-lg font-semibold mb-4 text-gray-500">Ubah Status</h3>
          <div className="flex items-center gap-4">
            <select
              onChange={(e) => setStatus(e.target.value)}
              defaultValue={requisition?.status}
              className="w-full md:w-1/3 text-gray-800"
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Issued">Issued (Tugaskan Kendaraan)</option>
              <option value="Returned">Returned (Kendaraan Kembali)</option>
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
      {/* )} */}
    </div>
  );
};

export default VehicleRequisitionDetailPage;
