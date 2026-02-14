import api from "../../../api";
import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import useVehiclesList from "../../../hooks/useVehiclesList";
import Swal from "sweetalert2";

const AddVehicleRequestForm = ({ projectId, onSuccess, onCancel }) => {
  const { vehicles, isLoading: isLoadingVehicles } = useVehiclesList();
  const [formData, setFormData] = useState({
    project_id: projectId,
    request_date: new Date().toISOString().slice(0, 10),
    notes: "",
    items: [{ vehicle_id: "" }],
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

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
      const response = await api.post("/v1/vehicle-requisitions", formData);
      
      const { id, vr_number } = response.data.data;
      Swal.fire({
        title: "Berhasil!",
        text: `Permintaan ${vr_number} berhasil dibuat.`,
        icon: "success",
        showCancelButton: true,
        confirmButtonText: "Download PDF",
        cancelButtonText: "Tutup",
        confirmButtonColor: "#2563EB",
        reverseButtons: true,
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const downloadResponse = await api.get(
              `/v1/vehicle-requisitions/${id}/export`,
              {
                responseType: "blob",
              }
            );

            const url = window.URL.createObjectURL(
              new Blob([downloadResponse.data])
            );
            const link = document.createElement("a");
            link.href = url;

            const contentDisposition = downloadResponse.headers["content-disposition"];
            let fileName = `Permintaan_Kendaraan_${vr_number}.pdf`;

            if (contentDisposition) {
              const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
              if (fileNameMatch && fileNameMatch.length === 2) fileName = fileNameMatch[1];
            }

            // Trigger Download
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();

            // Cleanup memori
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);

          } catch (error) {
            console.error("Gagal download via API:", error);
            Swal.fire("Gagal", "Gagal mengunduh file PDF.", "error");
          }
        }

        onSuccess();
      });

    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error("Error submitting vehicle requisition:", error);
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Terjadi kesalahan saat menyimpan data.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setErrors({});
  //   try {
  //     await api.post("/v1/vehicle-requisitions", formData);
  //     onSuccess();
  //   } catch (error) {
  //     if (error.response?.status === 422) {
  //       setErrors(error.response.data.errors);
  //     } else {
  //       setErrors({ general: "Terjadi kesalahan saat menyimpan data." });
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // console.log("Current formData state: ", formData);

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 my-6">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Permintaan
            </label>
            <input
              type="date"
              name="request_date"
              value={formData.request_date}
              onChange={handleChange}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900"
            />
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Rincian Kendaraan
        </h3>
        {formData.items.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-12 gap-4 items-center mb-4"
          >
            <div className="col-span-11">
              <select
                value={item.vehicle_id}
                onChange={(e) => {
                  console.log("Value dari select: ", e.target.value);
                  console.log("Tipe data: ", typeof e.target.value);
                  handleItemChange(index, "vehicle_id", e.target.value);
                }}
                required
                disabled={isLoadingVehicles}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900"
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
              {formData.items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-red-500 hover:text-red-700 p-2"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addItem}
          className="text-blue-600 flex items-center gap-2 mt-2 text-sm font-medium"
        >
          <Plus size={16} /> Tambah Kendaraan
        </button>

        <div className="flex justify-end gap-4 mt-8 pt-4 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg disabled:bg-gray-400"
          >
            {loading ? "Menyimpan..." : "Kirim Permintaan"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddVehicleRequestForm;
