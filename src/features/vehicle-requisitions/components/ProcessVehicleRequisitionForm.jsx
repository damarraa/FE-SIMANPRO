import React, { useState, useEffect } from "react";
import api from "../../../api";
import { checkVehicleAvailablity } from "../../vehicles/api";
import useVehiclesList from "../../../hooks/useVehiclesList";
import Swal from "sweetalert2";

const ProcessVehicleRequisitionForm = ({
  requisition,
  onSuccess,
  onCancel,
}) => {
  const { vehicles, isLoading: isLoadingVehicles } = useVehiclesList();
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRequestedVehicleAvailable, setIsRequestedVehicleAvailable] =
    useState(true);

  useEffect(() => {
    const initializeAssignments = async () => {
      if (requisition?.items?.length > 0 && vehicles.length > 0) {
        const available = vehicles.filter((v) => v.status === "Available");
        setAvailableVehicles(available);

        const availabilityChecks = requisition.items.map((item) =>
          checkVehicleAvailablity(item.vehicle.id)
        );
        const availabilityResults = await Promise.all(availabilityChecks);

        const initialAssignments = requisition.items.map((item, index) => {
          const isAvailable = availabilityResults[index].status === "Available";
          return {
            requisitionItemId: item.id,
            requestedVehicle: item.vehicle,
            isAvailable: isAvailable,
            vehicle_id: isAvailable ? item.vehicle.id.toString() : "",
            start_datetime: "",
            start_odometer: "",
          };
        });

        setAssignments(initialAssignments);
      }
    };

    initializeAssignments();
  }, [requisition, vehicles]);

  const handleAssignmentChange = (index, field, value) => {
    const updatedAssignments = [...assignments];
    updatedAssignments[index][field] = value;
    setAssignments(updatedAssignments);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!requisition.requested_by?.id) {
      console.error("ID Requester tidak ditemukan. Proses dibatalkan.");
      return;
    }

    setIsSubmitting(true);
    try {
      const assignmentsPayload = assignments.map((item) => ({
        vehicle_requisition_item_id: item.requisitionItemId,
        project_id: requisition.project?.id,
        vehicle_id: item.vehicle_id,
        start_datetime: item.start_datetime,
        start_odometer: item.start_odometer,
        user_id: requisition.requested_by.id,
      }));

      const payload = {
        assignments: assignmentsPayload,
      };

      console.log("Payload yang akan dikirim: ", payload);
      await api.post("/v1/vehicle-assignments/bulk", payload); Swal.fire({
        title: "Berhasil!",
        text: `Kendaraan berhasil ditugaskan untuk Permintaan ${requisition.vr_number}.`,
        icon: "success",
        showCancelButton: true,
        confirmButtonText: "Download Surat Jalan (PDF)",
        cancelButtonText: "Tutup",
        confirmButtonColor: "#2563EB",
        reverseButtons: true,
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const downloadResponse = await api.get(
              `/v1/vehicle-requisitions/${requisition.id}/export`,
              { responseType: "blob" }
            );

            const url = window.URL.createObjectURL(
              new Blob([downloadResponse.data])
            );
            const link = document.createElement("a");
            link.href = url;

            const contentDisposition = downloadResponse.headers["content-disposition"];
            let fileName = `Surat_Jalan_${requisition.vr_number}.pdf`;

            if (contentDisposition) {
              const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
              if (fileNameMatch && fileNameMatch.length === 2) fileName = fileNameMatch[1];
            }

            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();

            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
          } catch (error) {
            console.error("Gagal download PDF:", error);
            Swal.fire("Gagal", "Gagal mengunduh file PDF.", "error");
          }
        }

        onSuccess();
      });

    } catch (error) {
      console.error("Gagal menugaskan kendaraan:", error);
      Swal.fire("Gagal", "Terjadi kesalahan saat memproses data.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const requestedVehicle = requisition?.items?.[0]?.vehicle;

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 my-6">
      <h3 className="text-lg font-bold mb-4 text-gray-700">
        Proses Permintaan: {requisition.vr_number}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pb-4 border-b">
        <div>
          <label className="text-sm text-gray-500">Proyek</label>
          <p className="font-semibold text-gray-800">
            {requisition.project?.job_name}
          </p>
        </div>
        <div>
          <label className="text-sm text-gray-500">Meminta Kendaraan</label>
          <p className="font-semibold text-gray-800">
            {requestedVehicle?.name} ({requestedVehicle?.license_plate})
          </p>
        </div>
      </div>

      {requestedVehicle &&
        selectedVehicleId &&
        selectedVehicleId !== requestedVehicle.id.toString() && (
          <div className="bg-yellow-100 text-yellow-800 p-3 rounded-md mb-4 text-sm">
            ⚠️ **Perhatian**: Anda memilih kendaraan alternatif yang berbeda
            dari permintaan awal.
          </div>
        )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {assignments.map((item, index) => (
          <div
            key={item.requisitionItemId}
            className="border p-4 rounded-lg bg-white shadow-sm"
          >
            <p className="font-semibold text-gray-800 mb-2">
              Permintaan: {item.requestedVehicle.name} (
              {item.requestedVehicle.license_plate})
            </p>

            {!item.isAvailable && (
              <div className="bg-yellow-100 text-yellow-800 p-2 rounded-md mb-3 text-sm">
                ⚠️ Kendaraan yang diminta tidak tersedia. Silakan pilih
                alternatif.
              </div>
            )}

            {item.vehicle_id &&
              item.vehicle_id !== item.requestedVehicle.id.toString() && (
                <div className="bg-blue-100 text-blue-800 p-2 rounded-md mb-3 text-sm">
                  ℹ️ Anda memilih kendaraan alternatif yang berbeda dari
                  permintaan awal.
                </div>
              )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tugaskan Kendaraan
                </label>
                <select
                  value={item.vehicle_id}
                  onChange={(e) =>
                    handleAssignmentChange(index, "vehicle_id", e.target.value)
                  }
                  required
                  disabled={isLoadingVehicles}
                  className="block w-full px-3 py-2 border border-gray-300 text-gray-800 rounded-md shadow-sm"
                >
                  <option value="">Pilih Kendaraan</option>
                  {availableVehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.license_plate})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Ditugaskan
                </label>
                <input
                  type="date"
                  value={item.start_datetime}
                  onChange={(e) =>
                    handleAssignmentChange(
                      index,
                      "start_datetime",
                      e.target.value
                    )
                  }
                  required
                  className="block w-full px-3 py-2 border border-gray-300 text-gray-800 rounded-md shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Odometer Awal (km)
                </label>
                <input
                  type="number"
                  placeholder="km"
                  value={item.start_odometer}
                  onChange={(e) =>
                    handleAssignmentChange(
                      index,
                      "start_odometer",
                      e.target.value
                    )
                  }
                  required
                  className="block w-full px-3 py-2 border border-gray-300 text-gray-800 rounded-md shadow-sm"
                />
              </div>
            </div>
          </div>
        ))}

        <div className="flex justify-end gap-4 pt-4 mt-4 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg disabled:bg-gray-400"
          >
            {isSubmitting ? "Menyimpan..." : "Simpan & Tugaskan"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProcessVehicleRequisitionForm;
