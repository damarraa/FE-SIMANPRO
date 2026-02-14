import { useState, useEffect, useCallback } from "react";
import * as api from "../api/index";
import Swal from "sweetalert2";

const useAttendance = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [todayPresence, setTodayPresence] = useState(null);

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.getAttendanceHistory();
      setHistory(res.data);
      const today = new Date().toISOString().split("T")[0];
      const foundToday = res.data.find((h) => h.date === today);
      setTodayPresence(foundToday || null);
    } catch (error) {
      console.error("Failed to fetch attendance:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, []);

  const performCheckIn = async (formData) => {
    try {
      await api.checkIn(formData);
      Swal.fire("Berhasil", "Check In berhasil dicatat!", "success");
      fetchHistory();
      return true;
    } catch (error) {
      Swal.fire(
        "Gagal",
        error.response?.data?.message || "Terjadi kesalahan",
        "error"
      );
      return false;
    }
  };

  const performCheckOut = async (formData) => {
    try {
      await api.checkOut(formData);
      Swal.fire(
        "Berhasil",
        "Check Out berhasil! Hati-hati di jalan.",
        "success"
      );
      fetchHistory();
      return true;
    } catch (error) {
      Swal.fire(
        "Gagal",
        error.response?.data?.message || "Terjadi kesalahan",
        "error"
      );
      return false;
    }
  };

  return {
    history,
    todayPresence,
    isLoading,
    performCheckIn,
    performCheckOut,
    refresh: fetchHistory,
  };
};

export default useAttendance;
