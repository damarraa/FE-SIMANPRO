import { useState, useEffect, useCallback } from "react";
import * as api from "../api/index";
import Swal from "sweetalert2";

const useLeaveRequests = () => {
  const [leavesData, setLeavesData] = useState({
    data: [],
    current_page: 1,
    last_page: 1,
    total: 0,
  });

  const [leaveDetail, setLeaveDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLeaves = useCallback(async (params = {}) => {
    setIsLoading(true);
    try {
      const res = await api.getLeaveRequests(params);
      setLeavesData({
        data: res.data || [],
        current_page: res.meta?.current_page || 1,
        last_page: res.meta?.last_page || 1,
        total: res.meta?.total || 0,
        from: res.meta?.from || 0,
        to: res.meta?.to || 0,
      });
    } catch (error) {
      console.error("Failed to fetch leaves:", error);
      setLeavesData((prev) => ({ ...prev, data: [] }));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchDetail = useCallback(async (id) => {
    setIsLoading(true);
    try {
      const res = await api.getLeaveDetail(id);
      setLeaveDetail(res.data);
    } catch (error) {
      console.error("Failed to fetch detail:", error);
      Swal.fire("Error", "Gagal memuat detail data.", "error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const submitLeave = async (formData) => {
    try {
      await api.createLeaveRequest(formData);
      Swal.fire("Berhasil", "Pengajuan cuti berhasil dikirim", "success");
      fetchLeaves();
      return true;
    } catch (error) {
      Swal.fire(
        "Gagal",
        error.response?.data?.message || "Gagal mengajukan cuti",
        "error"
      );
      return false;
    }
  };

  const processApproval = async (id, status, reason = null) => {
    try {
      await api.updateLeaveStatus(id, status, reason);

      Swal.fire(
        "Berhasil",
        `Status berhasil diubah menjadi ${status}`,
        "success"
      );
      setLeaveDetail((prev) => ({
        ...prev,
        status: status,
        rejection_reason: reason,
      }));

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

  const downloadPdf = async (id, fileName = "document.pdf") => {
    try {
      const blobData = await api.exportLeavePdf(id);

      const url = window.URL.createObjectURL(new Blob([blobData]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();

      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      console.error("Download PDF error:", error);
      Swal.fire("Gagal", "Gagal mengunduh PDF.", "error");
      return false;
    }
  };

  return {
    leavesData,
    leaveDetail,
    isLoading,
    fetchLeaves,
    fetchDetail,
    submitLeave,
    processApproval,
    downloadPdf,
    refresh: fetchLeaves,
  };
};

export default useLeaveRequests;
