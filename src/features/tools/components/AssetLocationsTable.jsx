import React, { useState } from "react";
import { createAssetLocation } from "../api/assetLocations";
import AssetLocationForm from "./AssetLocationForm";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

const AssetLocationsTable = ({ locations, isLoading, onDataUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const { id: toolId } = useParams();

  const handleSave = async (data) => {
    try {
      await createAssetLocation(toolId, data);
      setShowForm(false);
      onDataUpdate();

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Lokasi alat berhasil ditambahkan.",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Gagal menyimpan lokasi", error);
      Swal.fire({
        icon: "error",
        title: "Gagal Menyimpan",
        text:
          error.response?.data?.message ||
          "Terjadi kesalahan saat menyimpan lokasi.",
      });
    }
  };

  if (isLoading) return <p>Loading lokasi...</p>;

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Lokasi Alat
        </h3>
        <button
          onClick={() => setShowForm(true)}
          className="bg-[#2196F3] hover:bg-blue-600 text-white font-medium px-6 py-2 rounded-lg disabled:bg-gray-400"
        >
          Tambah Lokasi
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <AssetLocationForm
            onSave={handleSave}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                Gudang
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                Kuantitas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                Terakhir Diperbarui
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {locations.map((loc) => (
              <tr key={loc.id}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {loc.warehouse.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {loc.quantity}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(loc.last_moved_at).toLocaleDateString("id-ID")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssetLocationsTable;
