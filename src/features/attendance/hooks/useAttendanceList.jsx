import { useState, useCallback } from "react";
import * as attendanceApi from "../api/index";

const useAttendanceList = () => {
  const [attendanceData, setAttendanceData] = useState({
    data: [],
    current_page: 1,
    last_page: 1,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchAttendances = useCallback(async (params = {}) => {
    setIsLoading(true);
    try {
      const res = await attendanceApi.getAttendanceHistory(params);
      setAttendanceData({
        data: res.data || [],
        current_page: res.meta?.current_page || 1,
        last_page: res.meta?.last_page || 1,
        total: res.meta?.total || 0,
        from: res.meta?.from || 0,
        to: res.meta?.to || 0,
      });
    } catch (error) {
      console.error("Failed to fetch attendance list:", error);
      setAttendanceData((prev) => ({ ...prev, data: [] }));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    attendanceData,
    isLoading,
    fetchAttendances,
  };
};

export default useAttendanceList;
