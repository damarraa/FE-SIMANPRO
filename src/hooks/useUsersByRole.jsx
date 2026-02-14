import { useState, useEffect } from "react";
import api from "../api";

const useUsersByRole = (roleName) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!roleName) {
      setUsers([]);
      setIsLoading(false);
      return;
    }

    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/v1/lists/users-by-role/${roleName}`);
        setUsers(response.data);
      } catch (error) {
        setError(error);
        console.error(`Gagal mengambil user dengan role: ${roleName}`, e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [roleName]);

  return { users, isLoading, error };
};

export default useUsersByRole;
