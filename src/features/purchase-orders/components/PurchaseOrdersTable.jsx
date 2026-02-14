import React from "react";
import { Link } from "react-router-dom";

const StatusBadge = ({ status }) => {
  const color = {
    Draft: "bg-gray-100 text-gray-800",
    Submitted: "bg-blue-100 text-blue-800",
    Completed: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
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

const PurchaseOrdersTable = ({ purchaseOrders = [], isLoading }) => {
  if (isLoading) return <div className="text-center p-8">Loading...</div>;
  if (purchaseOrders.length === 0) {
    <div className="text-center text-gray-600 p-8 bg-white rounded-xl shadow-sm">
      Tidak ada data Purchase Order.
    </div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Nomor PO
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Supplier
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Tanggal Order
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Gudang Tujuan
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {purchaseOrders.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {item.po_number}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {item.supplier?.name || "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Date(item.order_date).toLocaleDateString("id-ID")}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {item.warehouse?.name || "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <StatusBadge status={item.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                <Link
                  to={`/purchase-orders/${item.id}`}
                  className="text-blue-600 hover:text-blue-900"
                >
                  Detail
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </div>
    </div>
  );
};

export default PurchaseOrdersTable;
