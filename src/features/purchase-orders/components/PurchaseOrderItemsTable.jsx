import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import useMaterialsList from "../../../hooks/useMaterialsList";

const PurchaseOrderItemsTable = ({ items, setItems }) => {
  const { materials, isLoading: isLoadingMaterials } = useMaterialsList();

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { material_id: "", quantity: 1, unit_price: "" }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border">
      <h3 className="text-lg font-semibold mb-4">Rincian Material</h3>
      {items.map((item, index) => (
        <div key={index} className="grid grid-cols-12 gap-4 items-center mb-4">
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
                  {m.name}
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
  );
};

export default PurchaseOrderItemsTable;
