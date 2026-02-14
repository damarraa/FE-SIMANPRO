import { useState, useEffect, useCallback } from "react";
import { userManagementApi } from "../../../services/userManagementService";

const useEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [pagination, setPagination] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const [sortBy, setSortBy] = useState("employee_id");
  const [sortDirection, setSortDirection] = useState("asc");

  const fetchEmployees = useCallback(
    async (currPage, currSearch, currSortBy, currSortDir) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await userManagementApi.getEmployees(
          currPage,
          currSearch,
          currSortBy,
          currSortDir
        );

        const responseBody = response.data || response;

        if (responseBody.data && Array.isArray(responseBody.data)) {
          setEmployees(responseBody.data);

          if (responseBody.meta) {
            setPagination(responseBody.meta);
          } else if (responseBody.current_page) {
            const { data, ...paginationMeta } = responseBody;
            setPagination(paginationMeta);
          } else {
            setPagination({});
          }
        } else if (Array.isArray(responseBody)) {
          setEmployees(responseBody);
          setPagination({});
        } else {
          setEmployees([]);
        }
      } catch (err) {
        console.error("Gagal mengambil data karyawan", err);
        setError("Gagal memuat data karyawan.");
        setEmployees([]);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchEmployees(page, searchTerm, sortBy, sortDirection);
  }, [page, searchTerm, sortBy, sortDirection, fetchEmployees]);

  useEffect(() => {
    if (page !== 1) {
      setPage(1);
    } else {
      fetchEmployees(1, searchTerm, sortBy, sortDirection);
    }
  }, [searchTerm]);

  const refresh = () => {
    fetchEmployees(page, searchTerm, sortBy, sortDirection);
  };

  const handleSort = (field) => {
    const isAsc = sortBy === field && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setSortBy(field);
  };

  return {
    employees,
    pagination,
    isLoading,
    error,
    page,
    setPage,
    searchTerm,
    setSearchTerm,
    refresh,
    sortBy,
    sortDirection,
    handleSort,
  };
};

export default useEmployees;
