import { useState, useEffect } from "react";
import api from "../../../api";

const useJobTypesList = () => {
  const [jobTypes, setJobTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/v1/job-types`);
        setJobTypes(response.data.data);
      } catch (error) {
        console.error("Gagal mengambil tipe pekerjaan", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return { jobTypes, setJobTypes, isLoading };
};

export default useJobTypesList;
