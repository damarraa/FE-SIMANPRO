import { useState, useEffect } from "react";
import api from "../../../api";

const useLaborTypesList = () => {
  const [laborTypes, setLaborTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/v1/lists/labor-types`);
        setLaborTypes(response.data);
      } catch (error) {
        console.error("Gagal mengambil tipe pekerja", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return { laborTypes, setLaborTypes, isLoading };
};

export default useLaborTypesList;
