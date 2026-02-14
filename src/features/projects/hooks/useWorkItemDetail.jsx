import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getWorkItemDetails, updateWorkItem } from "../api/workItems";

const useWorkItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [workItem, setWorkItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refresh = () => setRefreshTrigger((prev) => prev + 1);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await getWorkItemDetails(id);
        setWorkItem(response.data);
      } catch (error) {
        console.error("Gagal mengambil detail item pekerjaan", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchData();
  }, [id, refreshTrigger]);

  const update = async (formData) => {
    await updateWorkItem(id, formData);
    refresh();
  };

  return { workItem, isLoading, update, refresh };
};

export default useWorkItemDetail;
