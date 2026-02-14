import { useState, useEffect } from "react";
import api from "../api";

const useTeamMemberList = () => {
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [userRes, contactRes] = await Promise.all([
          api.get("/v1/lists/users"),
          api.get("/v1/lists/contacts"),
        ]);

        // Formatting and merge
        const userOptions = userRes.data.map((u) => ({
          value: `user-${u.id}`,
          label: `${u.name} (Sistem)`,
        }));
        const contactOptions = contactRes.data.map((c) => ({
          value: `contact-${c.id}`,
          label: c.name,
        }));

        setOptions([...userOptions, ...contactOptions]);
      } catch (error) {
        console.error("Gagal mengambil daftar anggota tim", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return { options, isLoading };
};

export default useTeamMemberList;
