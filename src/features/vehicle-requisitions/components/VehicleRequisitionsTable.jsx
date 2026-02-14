import React from "react";
import { Link } from "react-router-dom";

const StatusBadge = ({ status }) => {
  const color = {
    Pending: "bg-yellow-100 text-yellow-800",
    Approved: "bg-blue-100 text-blue-800",
    Issued: "bg-green-100 text-green-800",
    Returned: "bg-gray-100 text-gray-800",
    Rejected: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`px-2 py-1 text-xs rounded-full font-medium ${color[status]}} 'bg-gray-100'`}
    >
      {status}
    </span>
  );
};

const VehicleRequisitionsTable = ({ requisitions = [], isLoading }) => {
  if (isLoading) return <div className="text-center p-8">Loading...</div>;
  if (requisitions.length === 0) {
    return (
      <div className="text-center text-gray-600 p-8 bg-white rounded-xl shadow-sm">
        Tidak ada data Permintaan Kendaraan.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                No.
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                Proyek
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                Nama Kendaraan & Alat Berat
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
          <tbody className="bg-white divide-y divide-gray-200">
            {requisitions.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {item.vr_number}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {item.project?.job_name || "-"}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {item.items
                    ?.map((vehicleItem) => vehicleItem.vehicle.name)
                    .join(", ") || "-"}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {new Date(item.request_date).toLocaleDateString("id-ID")}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {item.requested_by?.name || "-"}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  <StatusBadge status={item.status} />
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                  <Link
                    to={`/vehicle-requisitions/${item.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Detail
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VehicleRequisitionsTable;
