import { useState, useEffect } from "react";
import api from "../api";

const useMaterialsList = () => {
  const [materials, setMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await api.get("/v1/lists/materials");
        setMaterials(response.data);
      } catch (error) {
        console.error("Gagal mengambil daftar material", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMaterials();
  }, []);

  return { materials, isLoading };
};

export default useMaterialsList;
