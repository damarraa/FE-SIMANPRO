import React, { useState } from "react";
import { ArrowLeft, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useOfficeLocations from "./hooks/useOfficeLocations";
import MapPicker from "../../Components/MapPicker";

const OfficeLocationCreatePage = () => {
  const navigate = useNavigate();
  const { createLocation } = useOfficeLocations();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    latitude: "0.507067",
    longitude: "101.447779",
    radius_meter: 10,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMapPositionChange = (newPosition) => {
    const [lat, lng] = newPosition;
    setFormData((prev) => ({
      ...prev,
      latitude: lat.toFixed(6),
      longitude: lng.toFixed(6),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = { ...formData, radius: parseInt(formData.radius) };
    await createLocation(payload);
    setIsSubmitting(false);
  };

  const mapPosition = [
    parseFloat(formData.latitude),
    parseFloat(formData.longitude),
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-500 hover:text-blue-600 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h1 className="text-2xl font-bold text-[#0D47A1] mb-6 flex items-center gap-2">
          <MapPin className="w-6 h-6" /> Tambah Lokasi Baru
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Kantor
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Contoh: Kantor Pusat - Jakarta"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alamat Lengkap
              </label>
              <textarea
                name="address"
                required
                rows="3"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              ></textarea>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tentukan Titik Lokasi (Geser Pin)
            </label>
            <div className="h-64 rounded-lg overflow-hidden border border-gray-300 mb-4">
              {/* Render Map Picker */}
              <MapPicker
                position={mapPosition}
                onPositionChange={handleMapPositionChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Latitude
                </label>
                <input
                  type="text"
                  name="latitude"
                  required
                  value={formData.latitude}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Longitude
                </label>
                <input
                  type="text"
                  name="longitude"
                  required
                  value={formData.longitude}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Radius Toleransi (Meter)
                </label>
                <input
                  type="number"
                  name="radius_meter"
                  required
                  min="10"
                  value={formData.radius}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              *Radius menentukan seberapa jauh karyawan boleh melakukan absen
              dari titik pusat kantor.
            </p>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#2196F3] hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg shadow-md disabled:bg-gray-300 transition flex items-center gap-2"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan Lokasi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OfficeLocationCreatePage;
