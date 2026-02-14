import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMaterialRequisition, updateMaterialRequisition } from "../api";

const useMaterialRequisitionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [requisition, setRequisition] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await getMaterialRequisition(id);
        setRequisition(response.data);
      } catch (error) {
        console.error("Gagal mengambil detail Permintaan Material", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const update = async (formData) => {
    try {
      const response = await updateMaterialRequisition(id, formData);
      setRequisition(response.data.data || response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
  // const update = async (formData) => {
  //   await updateMaterialRequisition(id, formData);
  //   navigate("/material-requisitions", {
  //     state: { message: "Data Permintaan Material berhasil diperbarui! " },
  //   });
  // };

  return { requisition, isLoading, update };
};

export default useMaterialRequisitionDetail;
