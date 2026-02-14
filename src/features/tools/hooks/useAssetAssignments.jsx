import { useState, useEffect } from "react";
import { getAssetAssignments } from "../api/assetAssignments";

const useAssetAssignments = (toolId) => {
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!toolId) return;
    const fetchData = async () => {
      try {
        const response = await getAssetAssignments(toolId);
        setAssignments(response.data);
      } catch (error) {
        console.error("Gagal mengambil data histori aset", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [toolId]);

  return { assignments, isLoading };
};

export default useAssetAssignments;
