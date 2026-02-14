import { useState, useEffect } from "react";
import { getInventoryStocks } from "../api/inventoryStocks";

const useInventoryStocks = (warehouseId) => {
  const [stocks, setStocks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!warehouseId) return;
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await getInventoryStocks(warehouseId);
        setStocks(response.data);
      } catch (error) {
        console.error("Gagal mengambil data stok inventaris", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [warehouseId]);

  return { stocks, isLoading };
};

export default useInventoryStocks;
