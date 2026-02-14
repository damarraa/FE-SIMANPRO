import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { ShoppingBag, Plus, Trash2 } from "lucide-react";
import useSuppliers from "../../hooks/useSuppliers";
import useWarehousesList from "../../hooks/useWarehousesList";
import useMaterialsList from "../../hooks/useMaterialsList";

const PurchaseOrderCreatePage = () => {
  const navigate = useNavigate();
  const { suppliers, isLoading: isLoadingSuppliers } = useSuppliers();
  const { warehouses, isLoading: isLoadingWarehouses } = useWarehousesList();
  const { materials, isLoading: isLoadingMaterials } = useMaterialsList();

  const [formData, setFormData] = useState({
    supplier_id: "",
    warehouse_id: "",
    order_date: new Date().toISOString().slice(0, 10),
    notes: "",
    items: [],
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { material_id: "", quantity: 1, unit_price: "" }],
    }));
  };

  const removeItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      await api.post("/v1/purchase-orders", formData);
      navigate("/purchase-orders", {
        state: { message: "Purchase Order baru berhasil dibuat!" },
      });
    } catch (err) {
      if (err.response?.status === 422) setErrors(err.response.data.errors);
      else setErrors({ general: "Gagal menyimpan data." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-8 flex items-center gap-2">
        <ShoppingBag className="w-6 h-6" />
        Buat Purchase Order (PO) Baru
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="">
              <label htmlFor="supplier_id">Supplier</label>
              <select
                name="supplier_id"
                id="supplier_id"
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

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Rincian Material</h3>
          {formData.items.map((item, index) => (
            <div className="grid grid-cols-12 gap-4 items-center mb-4">
              <div className="col-span-5">
                <select
                  value={item.material_id}
                  onChange={(e) =>
                    handleItemChange(index, "material_id", e.target.value)
                  }
                  required
                  disabled={isLoadingMaterials}
                  className="w-full"
                >
                  <option value="">Pilih Material</option>
                  {materials.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.sku})
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-3">
                <input
                  type="number"
                  placeholder="Kuantitas"
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(index, "quantity", e.target.value)
                  }
                  required
                  className="w-full"
                />
              </div>

              <div className="col-span-3">
                <input
                  type="number"
                  placeholder="Harga Satuan"
                  value={item.unit_price}
                  onChange={(e) =>
                    handleItemChange(index, "unit_price", e.target.value)
                  }
                  required
                  className="w-full"
                />
              </div>

              <div className="col-span-1">
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-red-500"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addItem}
            className="text-blue-600 flex items-center gap-2 mt-4"
          >
            <Plus size={16} />
            Tambah Baris
          </button>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button type="button" onClick={() => navigate("/purchase-orders")}>
            Batal
          </button>
          <button type="submit" disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan PO"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PurchaseOrderCreatePage;
