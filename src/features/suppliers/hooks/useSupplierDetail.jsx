import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSupplier, updateSupplier } from "../api";

const useSupplierDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSupplier = async () => {
      setIsLoading(true);
      try {
        const response = await getSupplier(id);
        setSupplier(response.data);
      } catch (e) {
        setError(e);
        console.error("Gagal mengambil detail supplier", e);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchSupplier();
    }
  }, [id]);

  const update = async (formData) => {
    try {
      await updateSupplier(id, formData);
      navigate("/suppliers", {
        state: { message: "Data supplier berhasil diperbarui!" },
      });
    } catch (err) {
      throw err;
    }
  };

  return { supplier, isLoading, error, update };
};

export default useSupplierDetail;
