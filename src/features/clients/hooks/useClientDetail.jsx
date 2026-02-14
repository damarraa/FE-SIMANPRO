import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getClient, updateClient } from "../api";

const useClientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClient = async () => {
      setIsLoading(true);
      try {
        const response = await getClient(id);
        setClient(response.data);
      } catch (e) {
        setError(e);
        console.error("Gagal mengambil detail klien", e);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchClient();
    }
  }, [id]);

  const update = async (formData) => {
    try {
      await updateClient(id, formData);
      navigate("/clients", {
        state: { message: "Data klien berhasil diperbarui!" },
      });
    } catch (err) {
      throw err;
    }
  };

  return { client, isLoading, error, update };
};

export default useClientDetail;
