import { useState, useEffect } from "react";
import api from "../api";

const useWarehousesList = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const response = await api.get("/v1/lists/warehouses");
        setWarehouses(response.data);
      } catch (error) {
        console.error("Gagal mengambil daftar gudang", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWarehouses();
  }, []);

  return { warehouses, setWarehouses, isLoading };
};

export default useWarehousesList;
