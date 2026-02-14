import { useState, useEffect, useCallback } from "react";
import { getDailyReportsDetail } from "../../projects/api/dailyReports";

const useDailyReportDetail = (reportId) => {
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReport = useCallback(async () => {
    if (!reportId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await getDailyReportsDetail(reportId);
      setReport(response.data);
    } catch (error) {
      console.error("Gagal mengambil detail laporan harian", error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [reportId]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  return { report, isLoading, error, refresh: fetchReport };
};

export default useDailyReportDetail;
