import { useState, useEffect } from "react";
import { getWorkItemLabors } from "../api/workItems";

const useWorkItemLabors = (workItemId) => {
  const [labors, setLabors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!workItemId) return;
    const fetchData = async () => {
      try {
        const response = await getWorkItemLabors(workItemId);
        setLabors(response.data);
      } catch (error) {
        console.error("Gagal mengambil data jasa", error);
      } finally {
        setIsLoading(false);
      }
    };
  }, [workItemId]);

  return { labors, isLoading };
};

export default useWorkItemLabors;
