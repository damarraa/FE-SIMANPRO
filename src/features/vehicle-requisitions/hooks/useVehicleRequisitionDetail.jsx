import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getVehicleRequisition, updateVehicleRequisition } from "../api";

const useVehicleRequisitionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [requisition, setRequisition] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await getVehicleRequisition(id);
        setRequisition(response.data);
      } catch (error) {
        console.error("Gagal mengambil detail Permintaan Kendaraan", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const update = async (formData) => {
    try {
      const response = await updateVehicleRequisition(id, formData);
      setRequisition(response.data.data || response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // const update = async (formData) => {
  //   await updateVehicleRequisition(id, formData);
  //   navigate("/vehicle-requisitions", {
  //     state: { message: "Data Permintaan berhasil diperbarui!" },
  //   });
  // };

  return { requisition, isLoading, update };
};

export default useVehicleRequisitionDetail;
