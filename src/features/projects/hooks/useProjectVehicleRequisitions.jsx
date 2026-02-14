import { useState, useEffect, useCallback } from "react";
import { getVehicleRequisitionsByProject } from "../api/requisitions";

const useProjectVehicleRequisitions = (projectId) => {
  const [requisitions, setRequisitions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRequisitions = useCallback(async () => {
    if (!projectId) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await getVehicleRequisitionsByProject(projectId);
      setRequisitions(response.data);
    } catch (error) {
      console.error("Gagal mengambil data permintaan kendaraan: ", error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchRequisitions();
  }, [fetchRequisitions]);

  return { requisitions, isLoading, error, refresh: fetchRequisitions };
};

export default useProjectVehicleRequisitions;
