import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getToolRequisition,
  updateToolRequisition,
} from "../api/toolRequisitions";

const useToolRequisitionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [requisition, setRequisition] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await getToolRequisition(id);
        setRequisition(response.data.data || response.data);
      } catch (error) {
        console.error("Gagal mengambil detail Permintaan Alat", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const update = async (formData) => {
    try {
      const response = await updateToolRequisition(id, formData);
      setRequisition(response.data.data || response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // const update = async (formData) => {
  //   await updateToolRequisition(id, formData);
  //   navigate("/tool-requisitions", {
  //     state: { message: "Data Permintaan Alat berhasil diperbarui!" },
  //   });
  // };

  return { requisition, isLoading, update };
};

export default useToolRequisitionDetail;
