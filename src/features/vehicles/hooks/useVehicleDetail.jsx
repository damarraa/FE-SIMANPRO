import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getVehicle, updateVehicle } from "../api";

const useVehicleDetail = (vehicleId) => {
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchVehicle = useCallback(async () => {
    if (!vehicleId) return;
    setIsLoading(true);
    try {
      const response = await getVehicle(vehicleId);
      setVehicle(response.data);
    } catch (error) {
      console.error("Gagal mengambil detail kendaraan", error);
    } finally {
      setIsLoading(false);
    }
  }, [vehicleId]);

  useEffect(() => {
    fetchVehicle();
  }, [fetchVehicle]);

  const update = async (formData) => {
    await updateVehicle(vehicleId, formData);
    navigate("/vehicles", {
      state: { message: "Data kendaraan berhasil diperbarui" },
    });
  };

  return { vehicle, isLoading, update, refresh: fetchVehicle };
};

export default useVehicleDetail;
