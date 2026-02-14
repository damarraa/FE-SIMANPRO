import { useState, useEffect, useCallback } from "react";
import api from "../../../api";

const useProjectToolRequisitions = (projectId) => {
  const [requisitions, setRequisitions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!projectId) return;
    setIsLoading(true);
    try {
      const response = await api.get(
        `/v1/projects/${projectId}/tool-requisitions`
      );
      setRequisitions(response.data.data);
    } catch (error) {
      console.error("Gagal mengambil data permintaan alat: ", error);
      setRequisitions([]);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { requisitions, isLoading, refresh: fetchData };
};

export default useProjectToolRequisitions;
