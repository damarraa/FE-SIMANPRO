import React, { useState, useEffect } from "react";
import api from "../../../api";
import { checkVehicleAvailablity } from "../../vehicles/api";
import useVehiclesList from "../../../hooks/useVehiclesList";

const ProcessVehicleRequisitionForm = ({
  requisition,
  onSuccess,
  onCancel,
}) => {
  const { vehicles, isLoading: isLoadingVehicles } = useVehiclesList();
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [startOdometer, setStartOdometer] = useState("");
  const [startDatetime, setStartDatetime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRequestedVehicleAvailable, setIsRequestedVehicleAvailable] =
    useState(true);

  useEffect(() => {
    const checkAndSetVehicles = async () => {
      if (vehicles.length > 0 && requisition?.items?.length > 0) {
        const requestedVehicleId = requisition.items[0].vehicle.id;

        try {
          const availability = await checkVehicleAvailablity(
            requestedVehicleId
          );

          if (availability.status === "Available") {
            setSelectedVehicleId(requestedVehicleId.toString());
            setIsRequestedVehicleAvailable(true);
          } else {
            setIsRequestedVehicleAvailable(false);
          }
        } catch (error) {
          console.error("Gagal mengecek ketersediaan kendaraan: ", error);
          setIsRequestedVehicleAvailable(false);
        }
        setAvailableVehicles(vehicles.filter((v) => v.status === "Available"));
      }
    };

    checkAndSetVehicles();
  }, [vehicles, requisition]);

  // const handleAssignmentChange = (index, field, value) => {
  //   const updatedAssignments = [...assignments];
  //   updatedAssignments[index][field] = value;
  //   setAssignments(updatedAssignments);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!requisition.requested_by?.id) {
      console.error("ID Requester tidak ditemukan. Proses dibatalkan.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        vehicle_requisition_id: requisition.id,
        project_id: requisition.project?.id,
        vehicle_id: selectedVehicleId,
        start_datetime: startDatetime,
        start_odometer: startOdometer,
        // user_id: requisition.requester?.id || requisition.requested_by, // Asumsi ada ID requester
        user_id: requisition.requested_by.id,
      };

      // Debugging
      console.log("Payload yang akan dikirim: ", payload);
      await api.post("/v1/vehicle-assignments", payload);
      onSuccess();
    } catch (error) {
      console.error("Gagal menugaskan kendaraan:", error);
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

      {!isRequestedVehicleAvailable && (
        <div className="bg-yellow-100 text-yellow-800 p-3 rounded-md mb-4 text-sm">
          ⚠️ **Perhatian**: Kendaraan "{requestedVehicle?.name}" yang diminta
          sedang tidak tersedia. Silakan pilih alternatif lain.
        </div>
      )}

      {requestedVehicle &&
        selectedVehicleId &&
        selectedVehicleId !== requestedVehicle.id.toString() && (
          <div className="bg-yellow-100 text-yellow-800 p-3 rounded-md mb-4 text-sm">
            ⚠️ **Perhatian**: Anda memilih kendaraan alternatif yang berbeda
            dari permintaan awal.
          </div>
        )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tugaskan Kendaraan Spesifik
          </label>
          <select
            value={selectedVehicleId}
            onChange={(e) => setSelectedVehicleId(e.target.value)}
            required
            disabled={isLoadingVehicles}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900"
          >
            <option value="">Pilih Kendaraan yang Tersedia</option>
            {availableVehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} ({v.license_plate})
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Ditugaskan
            </label>
            <input
              type="date"
              value={startDatetime}
              onChange={(e) => setStartDatetime(e.target.value)}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Odometer Awal
            </label>
            <input
              type="number"
              placeholder="km"
              value={startOdometer}
              onChange={(e) => setStartOdometer(e.target.value)}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900"
            />
          </div>
        </div>
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
