import { useState, useEffect, useCallback } from "react";
import { getAllVehicleAssignments } from "../api";

const useAllVehicleAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [pagination, setPagination] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAssignments = useCallback(async (currPage, currSearch) => {
    setIsLoading(true);
    try {
      const response = await getAllVehicleAssignments({
        page: currPage,
        search: currSearch,
      });

      const responseBody = response.data || response;

      if (responseBody.data && Array.isArray(responseBody.data)) {
        setAssignments(responseBody.data);

        if (responseBody.meta) {
          setPagination(responseBody.meta);
        } else if (responseBody.current_page) {
          const { data, ...paginationMeta } = responseBody;
          setPagination(paginationMeta);
        } else {
          setPagination({});
        }
      } else if (Array.isArray(responseBody)) {
        setAssignments(responseBody);
        setPagination({});
      } else {
        setAssignments([]);
      }
    } catch (error) {
      setError(error);
      console.error("Gagal mengambil data penugasan", error);
      setAssignments([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssignments(page, searchTerm);
  }, [page, fetchAssignments]);

  useEffect(() => {
    if (page !== 1) {
      setPage(1);
    } else {
      fetchAssignments(1, searchTerm);
    }
  }, [searchTerm]);

  const refresh = () => {
    fetchAssignments(page, searchTerm);
  };

  return {
    assignments,
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

export default useAllVehicleAssignments;
