import React, { useState, useEffect } from "react";
import { Search, Map, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useOfficeLocations from "./hooks/useOfficeLocations";
import OfficeLocationsTable from "./components/OfficeLocationsTable";

const OfficeLocationListPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { locationsData, isLoading, fetchLocations, removeLocation } =
    useOfficeLocations();

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLocations({ page: 1, search });
    }, 500);
    return () => clearTimeout(timer);
  }, [search, fetchLocations]);

  const handleDelete = async (id) => {
    const success = await removeLocation(id);
    if (success) fetchLocations({ page: locationsData.current_page, search });
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold text-[#0D47A1] flex items-center gap-2">
          <Map className="w-6 h-6" /> Lokasi Kantor
        </h1>
        <button
          onClick={() => navigate("/office-locations/create")}
          className="bg-[#2196F3] hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg shadow-md flex items-center gap-2"
        >
          <Plus size={18} /> Tambah Lokasi
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8 p-4">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama atau alamat kantor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <OfficeLocationsTable
        data={locationsData.data}
        pagination={locationsData}
        isLoading={isLoading}
        onPageChange={(page) => fetchLocations({ page, search })}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default OfficeLocationListPage;
