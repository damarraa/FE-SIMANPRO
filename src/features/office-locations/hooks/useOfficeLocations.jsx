import { useState, useCallback } from "react";
import * as api from "../api/index";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const useOfficeLocations = () => {
  const navigate = useNavigate();
  const [locationsData, setLocationsData] = useState({
    data: [],
    current_page: 1,
    last_page: 1,
    total: 0,
  });
  const [locationDetail, setLocationDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLocations = useCallback(async (params = {}) => {
    setIsLoading(true);
    try {
      const res = await api.getOfficeLocations(params);
      setLocationsData(res);
    } catch (error) {
      console.error("Failed to fetch locations: ", error);
      Swal.fire("Error", "Gagal memuat data lokasi kantor.", "error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchDetail = useCallback(async (id) => {
    setIsLoading(true);
    try {
      const res = await api.getOfficeLocationDetail(id);
      setLocationDetail(res.data);
    } catch (error) {
      console.error("Failed to fetch detail: ", error);
      Swal.fire("Error", "Gagal memuat detail data.", "error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createLocation = async (formData) => {
    try {
      await api.createOfficeLocation(formData);
      Swal.fire("Sukses", "Lokasi kantor berhasil ditambahkan", "success");
      navigate("/office-locations");
      return true;
    } catch (error) {
      console.error("Failed to create data: ", error);
      Swal.fire(
        "Gagal",
        error.response?.data?.message || "Terjadi kesalahan",
        "error"
      );
      return false;
    }
  };

  const removeLocation = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Apakah anda yakin?",
        text: "Data lokasi akan dihapus permanen.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        confirmButtonText: "Ya, Hapus!",
        cancelButtonText: "Batal",
      });

      if (result.isConfirmed) {
        await locationApi.deleteOfficeLocation(id);
        Swal.fire("Terhapus!", "Data berhasil dihapus.", "success");
        return true;
      }
      return false;
    } catch (error) {
      Swal.fire("Gagal", "Gagal menghapus data.", "error");
      return false;
    }
  };

  return {
    locationsData,
    locationDetail,
    isLoading,
    fetchLocations,
    fetchDetail,
    createLocation,
    removeLocation,
  };
};

export default useOfficeLocations;
