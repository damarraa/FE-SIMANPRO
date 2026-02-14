import { useState, useCallback } from "react";
import * as departmentApi from "../api/index";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const useDepartments = () => {
  const navigate = useNavigate();

  const [departmentsData, setDepartmentsData] = useState({
    data: [],
    current_page: 1,
    last_page: 1,
    total: 0,
  });

  const [allDepartments, setAllDepartments] = useState([]);
  const [departmentDetail, setDepartmentDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDepartments = useCallback(async (params = {}) => {
    setIsLoading(true);
    try {
      const res = await departmentApi.getDepartments(params);
      setDepartmentsData(res);
    } catch (error) {
      console.error("Failed to fetch departments:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchAllDepartments = useCallback(async () => {
    try {
      const res = await departmentApi.getDepartments({ all: true });
      setAllDepartments(res.data);
    } catch (error) {
      console.error("Failed to fetch all departments:", error);
    }
  }, []);

  const fetchDetail = useCallback(
    async (id) => {
      setIsLoading(true);
      try {
        const res = await departmentApi.getDepartmentDetail(id);
        setDepartmentDetail(res.data || res);
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "Gagal memuat detail departemen.", "error");
        navigate("/departments");
      } finally {
        setIsLoading(false);
      }
    },
    [navigate]
  );

  const submitDepartment = async (formData, id = null) => {
    try {
      if (id) {
        await departmentApi.updateDepartment(id, formData);
        Swal.fire("Sukses", "Departemen berhasil diperbarui.", "success");
      } else {
        await departmentApi.createDepartment(formData);
        Swal.fire("Sukses", "Departemen berhasil ditambahkan.", "success");
      }
      navigate("/departments");
      return true;
    } catch (error) {
      Swal.fire(
        "Gagal",
        error.response?.data?.message || "Terjadi kesalahan sistem",
        "error"
      );
      return false;
    }
  };

  const removeDepartment = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Hapus Departemen?",
        text: "Data yang dihapus tidak dapat dikembalikan. Pastikan tidak ada karyawan di departemen ini.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        confirmButtonText: "Ya, Hapus",
        cancelButtonText: "Batal",
      });

      if (result.isConfirmed) {
        await departmentApi.deleteDepartment(id);
        Swal.fire("Terhapus", "Data berhasil dihapus.", "success");
        return true;
      }
    } catch (error) {
      Swal.fire(
        "Gagal",
        error.response?.data?.message || "Gagal menghapus data.",
        "error"
      );
    }
    return false;
  };

  return {
    departmentsData,
    allDepartments,
    departmentDetail,
    isLoading,
    fetchDepartments,
    fetchAllDepartments,
    fetchDetail,
    submitDepartment,
    removeDepartment,
  };
};

export default useDepartments;
