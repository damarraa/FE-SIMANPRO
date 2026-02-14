import { useState, useEffect } from "react";
import { getVehicleAssignments } from "../api";

const useVehicleAssignments = (vehicleId) => {
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refresh = () => setRefreshTrigger((prev) => prev + 1);

  useEffect(() => {
    if (!vehicleId) return;
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await getVehicleAssignments(vehicleId);
        setAssignments(response.data);
      } catch (error) {
        console.error("Gagal mengambil histori penugasan", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [vehicleId, refreshTrigger]);

  return { assignments, isLoading, refresh };
};

export default useVehicleAssignments;
