import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import usePurchaseOrderDetail from "./hooks/usePurchaseOrderDetail";
import PurchaseOrderDetailForm from "./components/PurchaseOrderDetailForm";
import PurchaseOrderItemsTable from "./components/PurchaseOrderItemsTable";
import { ShoppingBag } from "lucide-react";

const PurchaseOrderDetailPage = () => {
  const navigate = useNavigate();
  const { purchaseOrder, isLoading, update } = usePurchaseOrderDetail();

  const [formData, setFormData] = useState({
    supplier_id: "",
    warehouse_id: "",
    order_date: "",
    items: [],
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (purchaseOrder) {
      setFormData({
        supplier_id: purchaseOrder.supplier?.id || "",
        warehouse_id: purchaseOrder.warehouse?.id || "",
        order_date: purchaseOrder.order_date || "",
        notes: purchaseOrder.notes || "",
        items: purchaseOrder.items || [],
      });
    }
  }, [purchaseOrder]);

  //   const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     await update(formData);
  //   };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      await update(formData);
    } catch (err) {
      if (err.response?.status === 422) setErrors(err.response.data.errors);
      else setErrors({ general: "Gagal memperbarui data." });
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-8">
        Detail Purchase Order: {purchaseOrder?.po_number}
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <PurchaseOrderDetailForm
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Rincian Material</h3>
          <PurchaseOrderItemsTable
            items={formData.items}
            setItems={(newItems) =>
              setFormData((prev) => ({ ...prev, items: newItems }))
            }
          />
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button type="button" onClick={() => navigate("/purchase-orders")}>
            Kembali
          </button>
          <button type="submit">Simpan Perubahan</button>
        </div>
      </form>
    </div>
  );
};

export default PurchaseOrderDetailPage;
