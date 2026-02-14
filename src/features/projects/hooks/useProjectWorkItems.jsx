import { useState, useEffect } from "react";
import { getProjectWorkItems } from "../api/workItems";

const useProjectWorkItems = (projectId) => {
  const [workItems, setWorkItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refresh = () => setRefreshTrigger((prev) => prev + 1);

  useEffect(() => {
    if (!projectId) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await getProjectWorkItems(projectId);
        setWorkItems(response.data);
      } catch (error) {
        console.error("Gagal mengambil data RAB", error);
        setWorkItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [projectId, refreshTrigger]);

  return {
    workItems,
    isLoading,
    refresh,
  };
};

export default useProjectWorkItems;
