import { useState, useEffect } from "react";
import { getProjectExpenses } from "../api/expenses";

const useProjectExpenses = (projectId) => {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refresh = () => setRefreshTrigger((prev) => prev + 1);

  useEffect(() => {
    if (!projectId) return;
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await getProjectExpenses(projectId);
        setExpenses(response.data);
      } catch (error) {
        console.error("Gagal mengambil data biaya proyek", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [projectId, refreshTrigger]);

  return { expenses, isLoading, refresh };
};

export default useProjectExpenses;