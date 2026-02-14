import { useState, useEffect } from "react";
import api from "../../../api";

const useInventoryTools = (warehouseId) => {
  const [tools, setTools] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!warehouseId) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(
          `/v1/warehouses/${warehouseId}/inventory-tools`
        );

        setTools(response.data.data || response.data);
      } catch (error) {
        console.error("Gagal mengambil data stok inventaris alat", error);
        setTools([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [warehouseId]);

  return { tools, isLoading };
};

export default useInventoryTools;
