import { useState, useCallback } from "react";
import * as api from "../api/index";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const usePdo = () => {
  const navigate = useNavigate();

  const [pdosData, setPdosData] = useState({
    data: [],
    current_page: 1,
    last_page: 1,
    total: 0,
    from: 0,
    to: 0,
  });

  const [pdoDetail, setPdoDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPdos = useCallback(async (params = {}) => {
    setIsLoading(true);
    try {
      const res = await api.getPdos(params);
      setPdosData(res.data);
    } catch (error) {
      console.error("Failed to fetch PDOs: ", error);
      Swal.fire("Error", "Gagal memuat data PDO.", "error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchDetail = useCallback(async (id) => {
    setIsLoading(true);
    try {
      const res = await api.getPdoDetail(id);
      setPdoDetail(res.data);
    } catch (error) {
      console.error("Failed to fetch detail: ", error);
      Swal.fire("Error", "Gagal memuat detail data PDO.", "error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createPdo = async (formData) => {
    try {
      await api.createPdo(formData);
      Swal.fire("Sukses", "Pengajuan PDO berhasil dibuat", "success");
      navigate("/pdos");
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

  const updatePdo = async (id, formData) => {
    try {
      await api.updatePdo(id, formData);
      Swal.fire("Sukses", "Data PDO berhasil diperbarui", "success");
      navigate("/pdos");
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

  //   const removePdo = async (id) => {
  //     try {
  //       const result = await Swal.fire({
  //         title: "Apakah anda yakin?",
  //         text: "Data PDO akan dihapus permanen.",
  //         icon: "warning",
  //         showCancelButton: true,
  //         confirmButtonColor: "#d33",
  //         confirmButtonText: "Ya, Hapus!",
  //         cancelButtonText: "Batal",
  //       });

  //       if (result.isConfirmed) {
  //         await api.deletePdo(id);
  //         Swal.fire("Terhapus!", "Data berhasil dihapus.", "success");
  //         return true;
  //       }
  //       return false;
  //     } catch (error) {
  //       console.error("Failed to delete data: ", error);
  //       Swal.fire("Gagal", "Gagal menghapus data.", "error");
  //       return false;
  //     }
  //   };

  return {
    pdosData,
    pdoDetail,
    isLoading,
    fetchPdos,
    fetchDetail,
    createPdo,
    updatePdo,
    // removePdo,
  };
};

export default usePdo;
