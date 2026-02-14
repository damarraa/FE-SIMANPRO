import { useState, useEffect } from "react";
import { getToolRequisitions } from "../api/toolRequisitions";

const useToolRequisitions = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const responseData = await getToolRequisitions({
          page,
          searchTerm: searchTerm,
        });
        setData(responseData);
      } catch (error) {
        console.error("Gagal mengambil data Permintaan Alat", error);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchData();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [page, searchTerm]);

  return { data, isLoading, page, setPage, searchTerm, setSearchTerm };
};

export default useToolRequisitions;
