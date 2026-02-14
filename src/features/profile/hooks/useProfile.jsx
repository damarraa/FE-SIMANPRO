import { useState, useEffect } from "react";
import { getMyProfile, updateProfile } from "../api";
import { useAuthStore } from "../../../store/authStore";
import { normalizeUser } from "../../../store/authStore";

const useProfile = () => {
  const { user: authUser, refreshUser } = useAuthStore();

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const data = await getMyProfile();

        const normalized = normalizeUser(data);
        setUser(normalized);
        // setUser(data);
      } catch (e) {
        console.error("Gagal mengambil data profil", e);
      } finally {
        setIsLoading(false);
      }
    };

    if (authUser) {
      fetchProfile();
    }
  }, [authUser]);

  const update = async (formData) => {
    if (!user?.id) return;

    setErrors(null);
    try {
      await updateProfile(user.id, formData);
      await refreshUser();

      const updatedData = await getMyProfile();

      const normalizedUpdated = normalizeUser(updatedData);
      setUser(normalizedUpdated);
      // setUser(updatedData);

      return true;
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

export default useProfile;
