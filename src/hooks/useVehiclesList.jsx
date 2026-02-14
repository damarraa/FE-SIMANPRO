import { useState, useEffect } from "react";
import api from "../api";

const useVehiclesList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      setIsLoading(true);
      try {
        const response = await api.get("/v1/lists/vehicles");
        // console.log("Response Api mentah: ", response);
        setVehicles(response.data.data || []);
        // setVehicles(response.data);
      } catch (error) {
        console.error("Gagal mengambil daftar Kendaraan dan Alat Berat", error);
        setVehicles([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  return { vehicles, isLoading };
};

export default useVehiclesList;
