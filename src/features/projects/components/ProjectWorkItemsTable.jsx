import React, { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, Edit, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { createProjectWorkItem, deleteProjectWorkItem } from "../api/workItems";
import ProjectWorkItemForm from "./ProjectWorkItemForm";
import { useAuthStore } from "../../../store/authStore";
import Swal from "sweetalert2";

const ProjectWorkItemsTable = ({ workItems = [], isLoading, onDataUpdate }) => {
  const navigate = useNavigate();
  const { id: projectId } = useParams();
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [expandedGroups, setExpandedGroups] = useState({});

  const groupedWorkItems = useMemo(() => {
    return workItems.reduce((acc, item) => {
      const groupName = item.work_name;
      if (!acc[groupName]) {
        acc[groupName] = [];
      }
      acc[groupName].push(item);
      return acc;
    }, {});
  }, [workItems]);

  const handleSave = async (data) => {
    setIsSubmitting(true);
    try {
      await createProjectWorkItem(projectId, data);
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Item pekerjaan baru berhasil ditambahkan.",
        showConfirmButton: false,
        timer: 1500,
      });

      setShowForm(false);
      setEditingItem(null);
      onDataUpdate();
    } catch (error) {
      // console.error("Gagal menyimpan item pekerjaan", error);

      if (error.response?.status === 422) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
        });
        Toast.fire({
          icon: "warning",
          title: "Mohon lengkapi semua field yang wajib diisi.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal!",
          text:
            error.response?.data?.message ||
            "Terjadi kesalahan saat menyimpan data.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (workItemId) => {
    const result = await Swal.fire({
      title: "Hapus Item Pekerjaan?",
      text: "Data yang dihapus tidak dapat dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await deleteProjectWorkItem(workItemId);
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
        });
        Toast.fire({
          icon: "success",
          title: "Item pekerjaan berhasil dihapus.",
        });

        onDataUpdate();
      } catch (error) {
        console.error("Gagal menghapus item pekerjaan", error);
        Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: "Gagal menghapus item. Mungkin item ini memiliki data terkait.",
        });
      }
    }
  };

  const toggleGroup = (groupName) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  const user = useAuthStore((state) => state.user);
  const firstRole = user?.roles?.[0];
  const userRole =
    (typeof firstRole === "object" ? firstRole.name : firstRole) || "Guest";

  const hasFullAccess = ["Admin", "Super Admin"].includes(userRole);

  const numberOfColumns = 5 + (hasFullAccess ? 2 : 0);

  const handleAddNewClick = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingItem(null);
    setShowForm(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Uraian Pekerjaan
        </h3>
        {hasFullAccess && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
          >
            <Plus size={16} />
            {showForm ? "Tutup Form" : "Tambah Item"}
          </button>
        )}
      </div>

      {showForm && (
        <ProjectWorkItemForm
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
          isLoading={isSubmitting}
        />
      )}

      {isLoading && <p>Loading Uraian Pekerjaan...</p>}

      {!isLoading && workItems.length === 0 && (
        <div className="text-center text-gray-500 py-4 bg-white rounded-xl shadow-sm">
          Belum ada item pekerjaan.
        </div>
      )}

      {!isLoading && workItems.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Nama Pekerjaan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Volume (Kontrak)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Volume (Realisasi)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Satuan
                </th>
                {hasFullAccess && (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                      Total Material
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                      Total Jasa
                    </th>
                  </>
                )}
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Object.entries(groupedWorkItems).map(
                ([workName, groupItems]) => {
                  const isExpanded = expandedGroups[workName];
                  return (
                    <React.Fragment key={workName}>
                      <tr
                        className="bg-gray-100 hover:bg-gray-200 cursor-pointer"
                        onClick={() => toggleGroup(workName)}
                      >
                        <td className="px-6 py-3 text-sm font-semibold text-gray-700 flex items-center gap-2">
                          {isExpanded ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          )}
                          {workName} ({groupItems.length} item)
                        </td>
                        <td colSpan={numberOfColumns - 1}></td>
                      </tr>
                      {isExpanded &&
                        groupItems.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50">
                            {" "}
                            <td className="px-6 py-4 text-sm font-medium text-gray-900 pl-10">
                              {" "}
                              <div className="font-semibold">
                                {item.sub_work_name ?? item.work_name}
                              </div>
                              {/* {item.sub_work_name && (
                            <div className="text-xs text-gray-500">Kategori: {item.work_name}</div>
                          )} */}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {item.planned_volume?.toLocaleString("id-ID", {
                                maximumFractionDigits: 2,
                              })}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 font-semibold">
                              {item.realized_volume?.toLocaleString("id-ID", {
                                maximumFractionDigits: 2,
                              })}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {item.unit}
                            </td>
                            {hasFullAccess && (
                              <>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                  Rp{" "}
                                  {parseFloat(
                                    item.total_material_cost
                                  )?.toLocaleString("id-ID", {
                                    maximumFractionDigits: 2,
                                    minimumFractionDigits: 2,
                                  }) ?? "N/A"}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                  Rp{" "}
                                  {parseFloat(
                                    item.total_labor_cost
                                  )?.toLocaleString("id-ID", {
                                    maximumFractionDigits: 2,
                                    minimumFractionDigits: 2,
                                  }) ?? "N/A"}
                                </td>
                              </>
                            )}
                            <td className="px-6 py-4 text-right flex justify-end gap-2">
                              <button
                                onClick={() =>
                                  navigate(`/work-items/${item.id}`)
                                }
                                className="text-blue-600 hover:text-blue-800"
                                title="Edit Detail"
                              >
                                {" "}
                                <Edit size={18} />{" "}
                              </button>
                              {hasFullAccess && (
                                <button
                                  onClick={() => handleDelete(item.id)}
                                  className="text-red-500 hover:text-red-700"
                                  title="Hapus Item"
                                >
                                  {" "}
                                  <Trash2 size={18} />{" "}
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                    </React.Fragment>
                  );
                }
              )}

              {/* {workItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    <div className="font-bold">
                      {item.sub_work_name ?? item.work_name}
                    </div>
                    {item.sub_work_name && (
                      <div className="text-xs text-gray-500">
                        Kategori: {item.work_name}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.planned_volume}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.realized_volume?.toLocaleString("id-ID", {
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.unit}
                  </td>

                  {userRole === "Admin" ||
                    (userRole === "Super Admin" && (
                      <>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          Rp{" "}
                          {item.total_material_cost?.toLocaleString("id-ID") ??
                            "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          Rp{" "}
                          {item.total_labor_cost?.toLocaleString("id-ID") ??
                            "N/A"}
                        </td>
                      </>
                    ))}

                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <button
                      onClick={() => navigate(`/work-items/${item.id}`)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit size={18} />
                    </button>
                    {userRole === "Admin" ||
                      (userRole === "Super Admin" && (
                        <>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      ))}
                  </td>
                </tr>
              ))} */}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProjectWorkItemsTable;
