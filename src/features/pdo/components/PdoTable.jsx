import React from "react";
import { Link } from "react-router-dom";
import {
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

export default function PdoTable({ data, isLoading, onDelete }) {
  const formatIDR = (value) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusInfo = (item) => {
    if (item.direktur_id) {
      return {
        label: "Approved",
        className: "bg-green-100 text-green-800 border-green-200",
      };
    }
    if (item.pemeriksa_id) {
      return {
        label: "Checked Finance",
        className: "bg-blue-100 text-blue-800 border-blue-200",
      };
    }
    return {
      label: "Draft / Pending",
      className: "bg-gray-100 text-gray-800 border-gray-200",
    };
  };

  return (
    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg border border-gray-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider"
              >
                No. PDO / Tgl
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider"
              >
                Project
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider"
              >
                Pemohon
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider"
              >
                Total Jumlah
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-800 uppercase tracking-wider"
              >
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-10 text-center text-gray-500"
                >
                  <div className="animate-pulse flex justify-center items-center">
                    Loading data...
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-10 text-center text-gray-500"
                >
                  Belum ada data PDO.
                </td>
              </tr>
            ) : (
              data.map((item) => {
                const status = getStatusInfo(item);
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {item.no_pdo}
                      </div>
                      <div className="text-xs text-gray-700">
                        {formatDate(item.tgl_pdo)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {item.project?.job_name || "Unknown Project"}
                      </div>
                      <div className="text-xs text-gray-700">
                        {item.project?.contract_num}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {item.pemohon?.name || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      {formatIDR(item.total_jumlah)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <Link
                        to={`/pdos/${item.id}`}
                        className="text-blue-600 hover:text-blue-900 inline-block"
                        title="Detail"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </Link>

                      {!item.pemeriksa_id && (
                        <Link
                          to={`/pdos/${item.id}/edit`}
                          className="text-yellow-600 hover:text-yellow-900 inline-block"
                          title="Edit"
                        >
                          <PencilSquareIcon className="w-5 h-5" />
                        </Link>
                      )}

                      {!item.pemeriksa_id && (
                        <button
                          onClick={() => onDelete(item.id)}
                          className="text-red-600 hover:text-red-900 inline-block"
                          title="Delete"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
