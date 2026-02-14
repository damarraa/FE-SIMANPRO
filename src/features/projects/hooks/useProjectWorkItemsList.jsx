import { useState, useEffect } from "react";
import { getProjectWorkItems } from "../api/workItems";

const useProjectWorkItemsList = (projectId) => {
  const [workItems, setWorkItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
        console.error("Gagal mengambil daftar item pekerjaan", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [projectId]);

  return { workItems, isLoading };
};

export default useProjectWorkItemsList;
