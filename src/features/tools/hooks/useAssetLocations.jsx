import { useState, useEffect } from "react";
import { getAssetLocations } from "../api/assetLocations";

const useAssetLocations = (toolId) => {
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const refresh = () => setRefreshTrigger((prev) => prev + 1);

  useEffect(() => {
    if (!toolId) return;
    const fetchData = async () => {
      try {
        const response = await getAssetLocations(toolId);
        setLocations(response.data);
      } catch (error) {
        console.error("Gagal mengambil data lokasi aset", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [toolId, refreshTrigger]);

  return { locations, isLoading, refresh };
};

export default useAssetLocations;
