import { useState, useEffect } from "react";
import { getMaterialRequisitions } from "../api";

const useMaterialRequisitions = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const responseData = await getMaterialRequisitions({
          page,
          search: searchTerm,
        });
        setData(responseData);
      } catch (error) {
        console.error("Gagal mengambil data Permintaan Material", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [page, searchTerm]);

  return { data, isLoading, page, setPage, searchTerm, setSearchTerm };
};

export default useMaterialRequisitions;
