import { useState, useEffect } from "react";
import api from "../api";

const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await api.get("/v1/lists/suppliers");
        setSuppliers(response.data);
      } catch (error) {
        console.error("Gagal mengambil data supplier", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  return { suppliers, isLoading };
};

export default useSuppliers;
