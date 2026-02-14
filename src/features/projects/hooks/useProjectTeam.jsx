import { useState, useEffect } from "react";
import { getProjectTeam } from "../api/team";

const useProjectTeam = (projectId) => {
  const [team, setTeam] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refresh = () => setRefreshTrigger((prev) => prev + 1);

  useEffect(() => {
    if (!projectId) return;
    const fetchData = async () => {
      try {
        const response = await getProjectTeam(projectId);
        setTeam(response.data);
      } catch (error) {
        console.error("Gagal mengambil data tim proyek", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [projectId, refreshTrigger]);

  return { team, isLoading, refresh };
};

export default useProjectTeam;
