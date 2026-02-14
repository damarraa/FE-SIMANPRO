import { useState, useEffect, useCallback } from "react";
import { getStockMovements } from "../api";

const useStockMovements = () => {
  const [movements, setMovements] = useState([]);
  const [pagination, setPagination] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchMovements = useCallback(async (currPage, currSearch) => {
    setIsLoading(true);
    try {
      const response = await getStockMovements({
        page: currPage,
        search: currSearch,
      });

      const responseBody = response.data || response;

      if (responseBody.data && Array.isArray(responseBody.data)) {
        setMovements(responseBody.data);

        if (responseBody.meta) {
          setPagination(responseBody.meta);
        } else if (responseBody.current_page) {
          const { data, ...paginationMeta } = responseBody;
          setPagination(paginationMeta);
        } else {
          setPagination({});
        }
      } else if (Array.isArray(responseBody)) {
        setMovements(responseBody);
        setPagination({});
      } else {
        setMovements([]);
      }
    } catch (error) {
      setError(error);
      console.error("Gagal mengambil data pergerakan stok", error);
      setMovements([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMovements(page, searchTerm);
  }, [page, fetchMovements]);

  useEffect(() => {
    if (page !== 1) {
      setPage(1);
    } else {
      fetchMovements(1, searchTerm);
    }
  }, [searchTerm]);

  const refresh = () => {
    fetchMovements(page, searchTerm);
  };

  return {
    movements,
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

export default useStockMovements;
