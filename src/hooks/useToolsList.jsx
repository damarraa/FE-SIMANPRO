import { useState, useEffect } from "react";
import api from "../api";

const useToolsList = () => {
  const [tools, setTools] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const response = await api.get("/v1/lists/tools");
        setTools(response.data);
      } catch (error) {
        console.error("Gagal mengambil daftar alat", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTools();
  }, []);

  return { tools, isLoading };
};

export default useToolsList;
