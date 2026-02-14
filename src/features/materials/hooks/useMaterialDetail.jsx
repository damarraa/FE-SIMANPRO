import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getMaterial, updateMaterial } from "../api";

const useMaterialDetail = () => {
  const { id } = useParams();
  const [material, setMaterial] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMaterial = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const response = await getMaterial(id);
      setMaterial(response.data);
    } catch (e) {
      setError(e);
      console.error("Gagal mengambil detail material", e);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchMaterial();
  }, [fetchMaterial]);

  const update = async (formData) => {
    try {
      return await updateMaterial(id, formData);
    } catch (err) {
      throw err;
    }
  };

  return { material, isLoading, error, update, refresh: fetchMaterial };
};

export default useMaterialDetail;
