import { useState, useEffect, useCallback } from "react";
import { getWarehouses } from "../api";

const useWarehouses = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [pagination, setPagination] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchWarehouses = useCallback(async (currPage, currSearch) => {
    setIsLoading(true);
    try {
      const response = await getWarehouses({
        page: currPage,
        search: currSearch,
      });

      const responseBody = response.data || response;
      if (responseBody.data && Array.isArray(responseBody.data)) {
        setWarehouses(responseBody.data);

        if (responseBody.meta) {
          setPagination(responseBody.meta);
        } else if (responseBody.current_page) {
          const { data, ...paginationMeta } = responseBody;
          setPagination(paginationMeta);
        } else {
          setPagination({});
        }
      } else if (Array.isArray(responseBody)) {
        setWarehouses(responseBody);
        setPagination({});
      } else {
        setWarehouses([]);
      }
    } catch (error) {
      console.error("Gagal mengambil data gudang: ", error);
      setError(error);
      setWarehouses([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWarehouses(page, searchTerm);
  }, [page, fetchWarehouses]);

  useEffect(() => {
    if (page !== 1) {
      setPage(1);
    } else {
      fetchWarehouses(1, searchTerm);
    }
  }, [searchTerm]);

  const refresh = () => {
    fetchWarehouses(page, searchTerm);
  };

  return {
    warehouses,
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

export default useWarehouses;
