import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getTool, updateTool } from "../api";

const useToolDetail = () => {
  const { id } = useParams();

  const [tool, setTool] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTool = useCallback(async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      const response = await getTool(id);
      setTool(response.data);
    } catch (e) {
      setError(e);
      console.error("Gagal mengambil detail alat", e);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTool();
  }, [fetchTool]);

  const update = async (formData) => {
    try {
      const result = await updateTool(id, formData);
      return result;
    } catch (err) {
      throw err;
    }
  };

  return { tool, isLoading, error, update, refresh: fetchTool };
};

export default useToolDetail;
