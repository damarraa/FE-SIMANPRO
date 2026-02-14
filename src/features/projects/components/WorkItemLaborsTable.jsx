import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import WorkItemLaborForm from "./WorkItemLaborForm";

const WorkItemLaborsTable = ({ labors = [], onParentUpdate, userRole }) => {
  const [localLabors, setLocalLabors] = useState(labors);
  const [showForm, setShowForm] = useState(false);
  const [editingLabor, setEditingLabor] = useState(null);

  useEffect(() => {
    setLocalLabors(labors);
  }, [labors]);

  const handleSave = (formData) => {
    let updatedLabors;
    if (editingLabor) {
      updatedLabors = localLabors.map((l) =>
        l.id === editingLabor.id || l.temp_id === editingLabor.temp_id
          ? { ...l, ...formData }
          : l
      );
    } else {
      updatedLabors = [
        ...localLabors,
        { ...formData, temp_id: `new-${Date.now()}` },
      ];
    }
    onParentUpdate({ labors: updatedLabors });
    setShowForm(false);
    setEditingLabor(null);
  };

  const handleDelete = (laborToDelete) => {
    const updatedLabors = localLabors.filter((l) => {
      if (laborToDelete.id) return l.id !== laborToDelete.id;
      if (laborToDelete.temp_id) return l.temp_id !== laborToDelete.temp_id;
      return true;
    });
    onParentUpdate({ labors: updatedLabors });
  };

  const handleEditClick = (labor) => {
    setEditingLabor(labor);
    setShowForm(true);
  };

  const handleAddClick = () => {
    setEditingLabor(null);
    setShowForm(true);
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Rincian Jasa</h3>
        {userRole === "Admin" ||
          (userRole === "Super Admin" && (
            <>
              <button
                onClick={handleAddClick}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm items-center gap-2"
              >
                <Plus size={16} /> Tambah Jasa
              </button>
            </>
          ))}
      </div>

      {showForm && (
        <WorkItemLaborForm
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
          initialData={editingLabor}
        />
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                Jenis Jasa/Pekerja
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                Kuantitas
              </th>
              {userRole === "Admin" ||
                (userRole === "Super Admin" && (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                      Upah/Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                      Total Biaya
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">
                      Aksi
                    </th>
                  </>
                ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {localLabors.map((item) => (
              <tr key={item.id || item.temp_id}>
                <td className="px-6 py-4 text-gray-800">
                  {item.laborType?.name || "Jenis Jasa Tidak Ditemukan"}
                </td>
                <td className="px-6 py-4 text-gray-800">
                  {item.quantity} {item.laborType?.unit}
                </td>
                {userRole === "Admin" ||
                  (userRole === "Super Admin" && (
                    <>
                      <td className="px-6 py-4 text-gray-800">
                        Rp {Number(item.rate).toLocaleString("id-ID")}
                      </td>
                      <td className="px-6 py-4 text-gray-800">
                        Rp {(item.quantity * item.rate).toLocaleString("id-ID")}
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

export default WorkItemLaborsTable;
