import { useState, useEffect } from "react";
import api from "../api";

const useProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get("/v1/lists/projects");
        setProjects(response.data);
      } catch (error) {
        console.error("Gagal mengambil daftar proyek", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return { projects, isLoading };
};

export default useProjectList;
