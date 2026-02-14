import { useState, useEffect, useCallback } from "react";
import { getTools } from "../api";

const useTools = () => {
  const [tools, setTools] = useState([]);
  const [pagination, setPagination] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchTools = useCallback(async (currPage, currSearch) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getTools({
        page: currPage,
        search: currSearch,
      });

      if (response.data && Array.isArray(response.data)) {
        setTools(response.data);
        if (response.meta) {
          setPagination(response.meta);
        } else {
          setPagination({});
        }
      } 
      
      else if (Array.isArray(response)) {
        setTools(response);
        setPagination({});
      } else {
        setTools([]);
        setPagination({});
      }

    } catch (e) {
      setError(e);
      console.error("Gagal mengambil data alat", e);
      setTools([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setPage(1);
  };

  useEffect(() => {
    fetchTools(page, searchTerm);
  }, [page, searchTerm, fetchTools]);

  const refresh = () => {
    fetchTools(page, searchTerm);
  };

  return {
    tools,
    pagination,
    isLoading,
    error,
    page,
    setPage,
    searchTerm,
    setSearchTerm: handleSearch,
    refresh,
  };
};

export default useTools;