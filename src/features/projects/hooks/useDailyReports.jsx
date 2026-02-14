import { useState, useEffect, useCallback } from "react";
import { getDailyReports } from "../api/dailyReports";

const useDailyReports = (projectId) => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refresh = () => setRefreshTrigger((prev) => prev + 1);

  useEffect(() => {
    if (!projectId) return;
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await getDailyReports(projectId);
        setReports(response.data);
      } catch (error) {
        console.error("Gagal mengambil data laporan harian", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [projectId, refreshTrigger]);

  return { reports, isLoading, refresh };
};

export default useDailyReports;
