import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, updateUser } from "../api";
// import { toast } from "react-hot-toast"; // upcoming notifikasi.

const useProfileDetail = (userId) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;

      setIsLoading(true);
      try {
        const response = await getUser(userId);
        setUser(response.data);
      } catch (e) {
        console.error("Gagal mengambil data user", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const update = async (formData) => {
    setErrors(null);
    try {
      await updateUser(userId, formData);

      const refreshedData = await getUser(userId);
      setUser(refreshedData.data);

      alert("Profil berhasil diperbarui!");
    } catch (err) {
      if (err.response && err.response.status === 422) {
        setErrors(err.response.data.errors);
      } else {
        setErrors({ general: "Terjadi kesalahan saat menyimpan data." });
      }
      throw err;
    }
  };

  return { user, isLoading, errors, update };
};

export default useProfileDetail;
