import { useState, useEffect } from "react";
import api from "../api";

const useUsersList = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await api.get("/v1/lists/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Gagal mengambil daftar user", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return { users, isLoading };
};

export default useUsersList;
