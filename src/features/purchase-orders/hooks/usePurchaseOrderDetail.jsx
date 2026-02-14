import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPurchaseOrder, updatePurchaseOrder } from "../api";

const usePurchaseOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [purchaseOrder, setPurchaseOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await getPurchaseOrder(id);
        setPurchaseOrder(response.data);
      } catch (e) {
        console.error("Gagal mengambil detail PO", e);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const update = async (formData) => {
    await updatePurchaseOrder(id, formData);
    navigate("/purchase-orders", {
      state: { message: "Data PO berhasil diperbarui!" },
    });
  };

  return { purchaseOrder, isLoading, update };
};

export default usePurchaseOrderDetail;
