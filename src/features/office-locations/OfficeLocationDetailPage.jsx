import React, { useEffect } from "react";
import { ArrowLeft, MapPin, Building, Ruler } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import useOfficeLocations from "./hooks/useOfficeLocations";

const OfficeLocationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { locationDetail, isLoading, fetchDetail } = useOfficeLocations();

  useEffect(() => {
    fetchDetail(id);
  }, [id, fetchDetail]);

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;
  if (!locationDetail)
    return <div className="p-8 text-center">Data tidak ditemukan.</div>;

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-500 hover:text-blue-600 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h1 className="text-xl font-bold text-[#0D47A1] flex items-center gap-2">
            <Building className="w-6 h-6" /> Detail Kantor
          </h1>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="text-sm text-gray-500 uppercase font-bold">
              Nama Kantor
            </label>
            <p className="text-lg text-gray-900 mt-1">{locationDetail.name}</p>
          </div>

          <div>
            <label className="text-sm text-gray-500 uppercase font-bold">
              Alamat
            </label>
            <p className="text-gray-700 mt-1">{locationDetail.address}</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-gray-500 uppercase font-bold">
                Koordinat
              </label>
              <p className="font-mono text-gray-700 mt-1">
                {locationDetail.latitude}, {locationDetail.longitude}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-500 uppercase font-bold flex items-center gap-1">
                <Ruler className="w-4 h-4" /> Radius
              </label>
              <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mt-1">
                {locationDetail.radius_meter} Meter
              </span>
            </div>
          </div>

          <div className="pt-4">
            <a
              href={`https://www.google.com/maps?q=${locationDetail.latitude},${locationDetail.longitude}`}
              target="_blank"
              rel="noreferrer"
              className="block w-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-100 hover:border-blue-300 transition group"
            >
              <MapPin className="w-8 h-8 mx-auto text-gray-400 group-hover:text-blue-500 mb-2" />
              <span className="text-gray-600 group-hover:text-blue-600 font-medium">
                Buka di Google Maps
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficeLocationDetailPage;
