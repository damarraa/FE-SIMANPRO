import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../api";

const useWarehouseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [warehouse, setWarehouse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWarehouse = async () => {
      try {
        const response = await api.get(`/v1/warehouses/${id}`);
        setWarehouse(response.data.data);
      } catch (e) {
        setError(e);
        console.error("Gagal mengambil detail gudang", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWarehouse();
  }, [id]);

  const updateWarehouse = async (formData) => {
    try {
      await api.put(`/v1/warehouses/${id}`, formData);
      navigate("/warehouses", {
        state: { message: "Data gudang berhasil diperbarui!" },
      });
    } catch (err) {
      throw err;
    }
  };

  return { warehouse, isLoading, error, updateWarehouse };
};

export default useWarehouseDetail;
