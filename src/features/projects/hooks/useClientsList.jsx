import { useState, useEffect } from "react";
import api from "../../../api";

const useClientsList = () => {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/v1/lists/clients");
        setClients(response.data);
      } catch (error) {
        console.error("Gagal mengambil daftar klien", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return { clients, setClients, isLoading };
};

export default useClientsList;
