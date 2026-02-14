import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import WorkItemMaterialForm from "./WorkItemMaterialForm";

const WorkItemMaterialsTable = ({
  materials = [],
  onParentUpdate,
  userRole,
}) => {
  const [localMaterials, setLocalMaterials] = useState(materials);
  const [showForm, setShowForm] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);

  useEffect(() => {
    setLocalMaterials(materials);
  }, [materials]);

  const handleSave = (formData) => {
    let updatedMaterials;
    if (editingMaterial) {
      updatedMaterials = localMaterials.map((m) =>
        m.id === editingMaterial.id || m.temp_id === editingMaterial.temp_id
          ? { ...m, ...formData }
          : m
      );
    } else {
      updatedMaterials = [
        ...localMaterials,
        { ...formData, temp_id: `new-${Date.now()}` },
      ];
    }
    onParentUpdate({ materials: updatedMaterials });
    setShowForm(false);
    setEditingMaterial(null);
  };

  const handleDelete = (materialToDelete) => {
    const updatedMaterials = localMaterials.filter((m) => {
      if (materialToDelete.id) return m.id !== materialToDelete.id;
      if (materialToDelete.temp_id)
        return m.temp_id !== materialToDelete.temp_id;
      return true;
    });
    onParentUpdate({ materials: updatedMaterials });
  };

  const handleEditClick = (material) => {
    setEditingMaterial(material);
    setShowForm(true);
  };

  const handleAddClick = () => {
    setEditingMaterial(null);
    setShowForm(true);
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Rincian Material
        </h3>

        {userRole === "Admin" ||
          (userRole === "Super Admin" && (
            <>
              <button
                onClick={handleAddClick}
                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
              >
                <Plus size={16} />
                Tambah Material
              </button>
            </>
          ))}
      </div>

      {showForm && (
        <WorkItemMaterialForm
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
          initialData={editingMaterial}
        />
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                Nama Material
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                Kuantitas
              </th>

              {userRole === "Admin" ||
                (userRole === "Super Admin" && (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                      Harga Satuan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                      Total Harga
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">
                      Aksi
                    </th>
                  </>
                ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {localMaterials.map((item) => (
              <tr key={item.id || item.temp_id}>
                <td className="px-6 py-4 text-gray-800">
                  {item.material?.name || "Pilih Material"}
                </td>
                <td className="px-6 py-4 text-gray-800">
                  {item.quantity} {item.material?.unit}
                </td>
                {userRole === "Admin" ||
                  (userRole === "Super Admin" && (
                    <>
                      <td className="px-6 py-4 text-gray-800">
                        Rp {Number(item.unit_price).toLocaleString("id-ID")}
                      </td>
                      <td className="px-6 py-4 text-gray-800">
                        Rp{" "}
                        {(item.quantity * item.unit_price).toLocaleString(
                          "id-ID"
                        )}
                      </td>
                      <td className="px-6 py-4 text-right flex justify-end gap-2">
                        <button
                          onClick={() => handleEditClick(item)}
                          className="text-blue-600"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="text-red-500"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkItemMaterialsTable;
