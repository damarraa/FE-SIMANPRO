import { useState, useCallback } from "react";
import * as api from "../api/index";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const usePayroll = () => {
  const navigate = useNavigate();

  const [payrollsData, setPayrollsData] = useState({
    data: [],
    current_page: 1,
    last_page: 1,
    total: 0,
  });

  const [payrollDetail, setPayrollDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPayrolls = useCallback(async (params = {}) => {
    setIsLoading(true);
    try {
      const res = await api.getPayrolls(params);
      setPayrollsData(res);
    } catch (error) {
      console.error("Failed to fetch payrolls: ", error);
      Swal.fire("Error", "Gagal memuat data payroll.", "error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchDetail = useCallback(async (id) => {
    setIsLoading(true);
    try {
      const res = await api.getPayrollDetail(id);
      setPayrollDetail(res.data);
    } catch (error) {
      console.error("Failed to fetch detail: ", error);
      Swal.fire("Error", "Gagal memuat detail data payroll.", "error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createPayroll = async (formData) => {
    try {
      await api.createPayroll(formData);
      Swal.fire("Sukses", "Data payroll berhasil ditambahkan", "success");
      navigate("/payrolls");
      return true;
    } catch (error) {
      console.error("Failed to create data: ", error);
      Swal.fire(
        "Gagal",
        error.response?.data?.message ||
          "Terjadi kesalahan saat menyimpan data.",
        "error"
      );
      return false;
    }
  };

  const updatePayroll = async (id, formData) => {
    try {
      await api.updatePayroll(id, formData);
      Swal.fire("Sukses", "Data payroll berhasil diperbarui", "success");
      navigate("/payrolls");
      return true;
    } catch (error) {
      console.error("Failed to update data: ", error);
      Swal.fire(
        "Gagal",
        error.response?.data?.message ||
          "Terjadi kesalahan saat memperbarui data.",
        "error"
      );
      return false;
    }
  };

  const removePayroll = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Apakah anda yakin?",
        text: "Data payroll akan dihapus permanen.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        confirmButtonText: "Ya, Hapus!",
        cancelButtonText: "Batal",
      });

      if (result.isConfirmed) {
        await api.deletePayroll(id);
        Swal.fire("Terhapus!", "Data berhasil dihapus.", "success");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to delete data: ", error);
      Swal.fire("Gagal", "Gagal menghapus data.", "error");
      return false;
    }
  };

  return {
    payrollsData,
    payrollDetail,
    isLoading,
    fetchPayrolls,
    fetchDetail,
    createPayroll,
    updatePayroll,
    removePayroll,
  };
};

export default usePayroll;
