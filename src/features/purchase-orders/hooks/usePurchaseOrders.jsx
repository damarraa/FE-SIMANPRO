import { useState, useEffect } from "react";
import { getPurchaseOrders } from "../api";

const usePurchaseOrders = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const responseData = await getPurchaseOrders({
          page,
          search: searchTerm,
        });
        setData(responseData);
      } catch (e) {
        console.error("Gagal mengambil data Purchase Order", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [page, searchTerm]);

  return { data, isLoading, page, setPage, searchTerm, setSearchTerm };
};

export default usePurchaseOrders;
