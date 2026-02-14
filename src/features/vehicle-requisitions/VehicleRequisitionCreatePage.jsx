import api from "../../api";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Truck, Plus, Trash2 } from "lucide-react";
import useProjectsList from "../../hooks/useProjectList";
import useVehiclesList from "../../hooks/useVehiclesList";

const VehicleRequisitionCreatePage = () => {
  const navigate = useNavigate();
  const { projects, isLoading: isLoadingProjects } = useProjectsList();
  const { vehicles, isLoading: isLoadingVehicles } = useVehiclesList();

  const [formData, setFormData] = useState({
    project_id: "",
    request_date: new Date().toISOString().slice(0, 10),
    notes: "",
    items: [],
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { vehicle_id: "" }],
    }));
  };

  const removeItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      await api.post("/v1/vehicle-requisitions", formData);
      navigate("/vehicle-requisitions", {
        state: { message: "Permintaan Kendaraan baru berhasil dibuat!" },
      });
    } catch (err) {
      if (err.response?.status === 422) setErrors(err.response.data.errors);
      else setErrors({ general: "Gagal menyimpan data." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold text-[#0D47A1] mb-8 flex items-center gap-2">
        <Truck className="w-6 h-6" />
        Buat Permintaan Kendaraan (VR) Baru
      </h1>
      <form onSubmit={handleSubmit}>
        {/* Form Utama */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="project_id"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Proyek
              </label>
              <select
                name="project_id"
                onChange={handleChange}
                required
                disabled={isLoadingProjects}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Pilih Proyek</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="request_date"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tanggal Permintaan
              </label>
              <input
                type="date"
                name="request_date"
                value={formData.request_date}
                onChange={handleChange}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Rincian Item */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-bold text-[#0D47A1] mb-8 flex items-center gap-2">
            Rincian Kendaraan
          </h3>
          {formData.items.map((item, index) => (
            <div
              key={index}
              className="w-full px-3 py-2 grid grid-cols-12 border border-gray-300 rounded-md gap-4 items-center mb-4 shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
            >
              <div className="col-span-11">
                <select
                  value={item.vehicle_id}
                  onChange={(e) =>
                    handleItemChange(index, "vehicle_id", e.target.value)
                  }
                  required
                  disabled={isLoadingVehicles}
                  className="w-full"
                >
                  <option value="">Pilih Kendaraan</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.license_plate || "N/A"})
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-1">
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-red-500"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addItem}
            className="text-blue-600 flex items-center gap-2 mt-4"
          >
            <Plus size={16} /> Tambah Baris
          </button>
        </div>

        {/* Tombol Aksi */}
        <div className="flex justify-end gap-4 mt-6 pt-6 border-t">
          <button
            type="button"
            onClick={() => navigate("/vehicle-requisitions")}
            className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#2196F3] text-white px-6 py-2 rounded-lg disabled:bg-gray-400"
          >
            {loading ? "Menyimpan..." : "Simpan VR"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VehicleRequisitionCreatePage;
