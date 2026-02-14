import { useState, useEffect, useCallback } from "react";
import { getClients } from "../api";

const useClients = () => {
  const [clients, setClients] = useState([]);
  const [pagination, setPagination] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchClients = useCallback(async (currPage, currSearch) => {
    setIsLoading(true);
    try {
      const response = await getClients({
        page: currPage,
        search: currSearch,
      });

      const responseBody = response.data || response;

      if (responseBody.data && Array.isArray(responseBody.data)) {
        setClients(responseBody.data);

        if (responseBody.meta) {
          setPagination(responseBody.meta);
        } else if (responseBody.current_page) {
          const { data, ...paginationMeta } = responseBody;
          setPagination(paginationMeta);
        } else {
          setPagination({});
        }
      } else if (Array.isArray(responseBody)) {
        setClients(responseBody);
        setPagination({});
      } else {
        setClients([]);
      }
    } catch (error) {
      setError(error);
      console.error("Gagal mengambil data klien", error);
      setClients(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients(page, searchTerm);
  }, [page, fetchClients]);

  useEffect(() => {
    if (page !== 1) {
      setPage(1);
    } else {
      fetchClients(1, searchTerm);
    }
  }, [searchTerm]);

  const refresh = () => {
    fetchClients(page, searchTerm);
  };

  return {
    clients,
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

export default useClients;
