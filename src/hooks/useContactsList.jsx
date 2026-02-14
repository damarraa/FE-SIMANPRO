import { useState, useEffect } from "react";
import api from "../api";

const useContactsList = () => {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      setIsLoading(true);
      try {
        const response = await api.get("/v1/lists/contacts");
        setContacts(response.data);
      } catch (error) {
        console.error("Gagal mengambil daftar kontak eksternal");
      } finally {
        setIsLoading(false);
      }
    };
    fetchContacts();
  }, []);

  return { contacts, isLoading };
};

export default useContactsList;
