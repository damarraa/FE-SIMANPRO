import React from "react";
import useSuppliers from "../../../hooks/useSuppliers";
import useWarehousesList from "../../../hooks/useWarehousesList";

const PurchaseOrderDetailForm = ({ formData, setFormData, errors }) => {
  const { suppliers, isLoading: isLoadingSuppliers } = useSuppliers();
  const { warehouses, isLoading: isLoadingWarehouses } = useWarehousesList();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="">
          <label htmlFor="supplier_id">Supplier</label>
          <select
            name="supplier_id"
            id="supplier_id"
            value={formData.supplier_id}
            onChange={handleChange}
            required
            disabled={isLoadingSuppliers}
            className="mt-1 w-full"
          >
            <option value="">Pilih Supplier</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="">
          <label htmlFor="warehouse_id">Gudang Tujuan</label>
          <select
            name="warehouse_id"
            id="warehouse_id"
            value={formData.warehouse_id}
            onChange={handleChange}
            required
            disabled={isLoadingWarehouses}
            className="mt-1 w-full"
          >
            <option value="">Pilih Gudang</option>
            {warehouses.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
        </div>

        <div className="">
          <label htmlFor="order_date">Tanggal Order</label>
          <input
            type="date"
            name="order_date"
            id="order_date"
            value={formData.order_date}
            onChange={handleChange}
            required
            className="mt-1 w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderDetailForm;
