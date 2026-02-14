import { useState, useEffect } from "react";
import { getMaintenanceLogs } from "../api";

const useMaintenanceLogs = (vehicleId) => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refresh = () => setRefreshTrigger((prev) => prev + 1);

  useEffect(() => {
    if (!vehicleId) return;
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await getMaintenanceLogs(vehicleId);
        setLogs(response.data);
      } catch (error) {
        console.error("Gagal mengambil data histori servis", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [vehicleId, refreshTrigger]);

  return { logs, isLoading, refresh };
};

export default useMaintenanceLogs;
