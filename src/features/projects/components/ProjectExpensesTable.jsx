import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Plus, Edit, Trash2 } from "lucide-react";
import {
  createProjectExpense,
  updateProjectExpense,
  deleteProjectExpense,
} from "../api/expenses";
import ProjectExpenseForm from "./ProjectExpenseForm";

const ProjectExpensesTable = ({ expenses = [], isLoading, onDataUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id: projectId } = useParams();
  const [apiError, setApiError] = useState("");
  const [editingExpense, setEditingExpense] = useState(null);

  const handleSave = async (data) => {
    setIsSubmitting(true);
    setApiError("");
    try {
      if (editingExpense) {
        await updateProjectExpense(editingExpense.id, data);
      } else {
        await createProjectExpense(projectId, data);
      }
      setShowForm(false);
      setEditingExpense(null);
      onDataUpdate();
    } catch (error) {
      console.error("Gagal menyimpan biaya", error);
      if (error.response?.status === 422) {
        const messages = Object.values(error.response.data.errors).flat();
        setApiError(messages.join(" "));
      } else {
        setApiError("Terjadi kesalahan saat menyimpan data.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (expenseId) => {
    if (window.confirm("Yakin ingin menghapus biaya ini?")) {
      try {
        await deleteProjectExpense(expenseId);
        onDataUpdate();
      } catch (error) {
        console.error("Gagal menghapus biaya", error);
      }
    }
  };

  const handleEditClick = (expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleAddClick = () => {
    setEditingExpense(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setApiError("");
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mt-8 border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Biaya Lain-lain</h3>
        <button
          // onClick={() => setShowForm(!showForm)}
          onClick={showForm ? handleCancel : handleAddClick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
        >
          <Plus size={16} />
          {showForm ? "Tutup" : "Tambah Biaya"}
        </button>
      </div>

      {showForm && (
        <ProjectExpenseForm
          onSave={handleSave}
          // onCancel={() => setShowForm(false)}
          onCancel={handleCancel}
          isLoading={isSubmitting}
          initialData={editingExpense}
        />
      )}

      {isLoading && (
        <p className="text-center text-gray-500 py-4">Memuat data biaya...</p>
      )}

      {!isLoading && expenses.length === 0 && (
        <div className="bg-white text-center py-8 rounded-xl shadow-sm border">
          <p className="text-gray-500">
            Belum ada biaya lain yang ditambahkan.
          </p>
        </div>
      )}

      {!isLoading && expenses.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Deskripsi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Jumlah
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {expenses.length > 0 ? (
                expenses.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                      {new Date(item.expense_date).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                      {item.description}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                      Rp {item.amount.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-gray-800 whitespace-nowrap">
                      <button
                        onClick={() => handleEditClick(item)}
                        className="text-blue-600 hover:text-blue-800 mr-4"
                        title="Edit Biaya"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-gray-600">
                    Belum ada biaya lain.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProjectExpensesTable;
