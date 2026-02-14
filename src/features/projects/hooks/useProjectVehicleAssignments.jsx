import { useState, useEffect } from "react";
import { getProjectVehicleAssignments } from "../api/vehicleAssignments";

const useProjectVehicleAssignments = (projectId) => {
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refresh = () => setRefreshTrigger((prev) => prev + 1);

  useEffect(() => {
    if (!projectId) return;
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await getProjectVehicleAssignments(projectId);
        setAssignments(response.data);
      } catch (error) {
        console.error("ERROR DETAIL:", error.response?.data || error.message);

        console.error(
          "Gagal mengambil data penugasan kendaraan dan alat berat.",
          error
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [projectId, refreshTrigger]);

  return { assignments, isLoading, refresh };
};

export default useProjectVehicleAssignments;
