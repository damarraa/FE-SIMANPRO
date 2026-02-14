import { useState, useEffect, useCallback } from "react";
import { rbacApi } from "../../../services/rbacService";

const useRoles = () => {
  const [roles, setRoles] = useState([]);
  const [pagination, setPagination] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const [sortBy, setSortBy] = useState("hierarchy");
  const [sortDirection, setSortDirection] = useState("asc");

  const fetchRoles = useCallback(
    async (currPage, currSearch, currSortBy, currSortDir) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await rbacApi.getRoles(
          currPage,
          currSearch,
          currSortBy,
          currSortDir
        );
        const responseBody = response.data || response;

        if (responseBody.data && Array.isArray(responseBody.data)) {
          setRoles(responseBody.data);

          if (responseBody.meta) {
            setPagination(responseBody.meta);
          } else if (responseBody.current_page) {
            const { data, ...paginationMeta } = responseBody;
            setPagination(paginationMeta);
          } else {
            setPagination({});
          }
        } else if (Array.isArray(responseBody)) {
          setRoles(responseBody);
          setPagination({});
        } else {
          setRoles([]);
        }
      } catch (err) {
        console.error("Gagal mengambil data roles", err);
        setError("Gagal memuat data role.");
        setRoles([]);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchRoles(page, searchTerm, sortBy, sortDirection);
  }, [page, searchTerm, sortBy, sortDirection, fetchRoles]);

  useEffect(() => {
    if (page !== 1) {
      setPage(1);
    } else {
      fetchRoles(1, searchTerm, sortBy, sortDirection);
    }
  }, [searchTerm]);

  const refresh = () => {
    fetchRoles(page, searchTerm, sortBy, sortDirection);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setPage(1);
  };

  const handleSort = (field) => {
    const isAsc = sortBy === field && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setSortBy(field);
  };

  return {
    roles,
    pagination,
    isLoading,
    error,
    page,
    setPage,
    searchTerm,
    setSearchTerm: handleSearch,
    refresh,
    sortBy,
    sortDirection,
    handleSort
  };
};

export default useRoles;
