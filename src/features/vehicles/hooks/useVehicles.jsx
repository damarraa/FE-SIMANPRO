import { useState, useEffect, useCallback } from "react";
import { getVehicles } from "../api";

const useVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [pagination, setPagination] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchVehicles = useCallback(async (currPage, currSearch) => {
    setIsLoading(true);
    try {
      const response = await getVehicles({
        page: currPage,
        search: currSearch,
      });

      if (response.data && Array.isArray(response.data)) {
        setVehicles(response.data);
        if (response.meta) {
          setPagination(response.meta);
        } else {
          setPagination({});
        }
      } else {
        console.warn("⚠️ Struktur data tidak sesuai ekspektasi", response);
        setVehicles([]);
      }
    } catch (e) {
      setError(e);
      console.error("Gagal mengambil data kendaraan", e);
      setVehicles([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicles(page, searchTerm);
  }, [page, fetchVehicles]);

  useEffect(() => {
    if (page !== 1) {
      setPage(1);
    } else {
      fetchVehicles(1, searchTerm);
    }
  }, [searchTerm]);

  const refresh = () => {
    fetchVehicles(page, searchTerm);
  };

  return {
    vehicles,
    pagination,
    isLoading,
    error,
    page,
    setPage,
    searchTerm,
    setSearchTerm,
    refresh,
  };
};

export default useVehicles;
