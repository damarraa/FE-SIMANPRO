import { useState, useEffect, useCallback } from "react";
import { getSuppliers } from "../api";

const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchSuppliers = useCallback(async (currPage, currSearch) => {
    setIsLoading(true);
    try {
      const response = await getSuppliers({
        page: currPage,
        search: currSearch,
      });

      const responseBody = response.data || response;

      if (responseBody.data && Array.isArray(responseBody.data)) {
        setSuppliers(responseBody.data);

        if (responseBody.meta) {
          setPagination(responseBody.meta);
        } else if (responseBody.current_page) {
          const { data, ...paginationMeta } = responseBody;
          setPagination(paginationMeta);
        } else {
          setPagination({});
        }
      } else if (Array.isArray(responseBody)) {
        setSuppliers(responseBody);
        setPagination({});
      } else {
        setSuppliers([]);
      }
    } catch (e) {
      setError(e);
      console.error("Gagal mengambil data supplier", e);
      setSuppliers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSuppliers(page, searchTerm);
  }, [page, fetchSuppliers]);

  useEffect(() => {
    if (page !== 1) {
      setPage(1);
    } else {
      fetchSuppliers(1, searchTerm);
    }
  }, [searchTerm]);

  const refresh = () => {
    fetchSuppliers(page, searchTerm);
  };

  return {
    suppliers,
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

export default useSuppliers;
