import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  createWorkActivityLog,
  deleteWorkActivityLog,
} from "../api/dailyReports";
import {
  Plus,
  Trash2,
  X,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
} from "lucide-react";
import WorkActivityLogForm from "./WorkActivityLogForm";
import { getImageUrl } from "../../../utils/image";
import Swal from "sweetalert2";

const WorkActivityLogsTable = ({
  activities = [],
  onDataUpdate,
  projectId,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const { id: reportId } = useParams();

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const sortedActivities = useMemo(() => {
    let sortableItems = [...activities];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];

        let comparison = 0;

        if (typeof valA === "number" && typeof valB === "number") {
          comparison = valA - valB;
        } else if (sortConfig.key === "realization_date") {
          comparison = new Date(valA) - new Date(valB);
        } else {
          comparison = (valA || "")
            .toString()
            .localeCompare((valB || "").toString());
        }

        return sortConfig.direction === "ascending" ? comparison : -comparison;
      });
    }

    return sortableItems;
  }, [activities, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";

    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <ChevronsUpDown size={14} className="inline ml-1 text-gray-400" />;
    }

    return sortConfig.direction === "ascending" ? (
      <ChevronUp size={14} className="inline ml-1" />
    ) : (
      <ChevronDown size={14} className="inline ml-1" />
    );
  };

  const handleSave = async (data) => {
    setIsSubmitting(true);
    try {
      await createWorkActivityLog(reportId, data);

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Log aktivitas pekerjaan berhasil ditambahkan.",
        showConfirmButton: false,
        timer: 1500,
      });

      setShowForm(false);
      onDataUpdate();
    } catch (error) {
      // console.error(
      //   "Gagal menyimpan log aktivitas",
      //   error.response?.data || error
      // );

      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text:
          error.response?.data?.message ||
          "Terjadi kesalahan saat menyimpan data.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (activityLogId) => {
    const result = await Swal.fire({
      title: "Hapus Log Aktivitas?",
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
        await deleteWorkActivityLog(activityLogId);
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
        });
        Toast.fire({
          icon: "success",
          title: "Log aktivitas berhasil dihapus.",
        });

        onDataUpdate();
      } catch (error) {
        console.error("Gagal menghapus log aktivitas", error);
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: "Gagal menghapus data.",
        });
      }
    }
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Log Aktivitas Pekerjaan
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
        >
          <Plus size={16} />
          {showForm ? "Tutup" : "Tambah Aktifitas"}
        </button>
      </div>

      {showForm && (
        <WorkActivityLogForm
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
          isLoading={isSubmitting}
          projectId={projectId}
        />
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 cursor-pointer hover:bg-gray-100"
                onClick={() => requestSort("work_name")}
              >
                Pekerjaan {getSortIcon("work_name")}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 cursor-pointer hover:bg-gray-100"
                onClick={() => requestSort("realized_volume")}
              >
                Volume Realisasi {getSortIcon("realized_volume")}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 cursor-pointer hover:bg-gray-100"
                onClick={() => requestSort("realization_date")}
              >
                Tanggal Realisasi {getSortIcon("realization_date")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 cursor-pointer hover:bg-gray-100">
                Catatan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 cursor-pointer hover:bg-gray-100">
                Foto Realisasi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 cursor-pointer hover:bg-gray-100">
                Foto Kontrol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 cursor-pointer hover:bg-gray-100">
                Dibuat Oleh
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 cursor-pointer hover:bg-gray-100">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedActivities.length > 0 ? (
              sortedActivities.map((item, idx) => {
                // console.log('Debug item:', sortedActivities);
                return (
                  <tr key={item.id}>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item.work_name || item.sub_work_name
                        ? `${item.work_name || ""}${
                            item.sub_work_name ? " - " + item.sub_work_name : ""
                          }`
                        : "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item.realized_volume}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item.realization_date || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item.notes || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item.realization_docs_urls?.length > 0 ? (
                        <div
                          className="flex items-center space-x-2 cursor-pointer"
                          onClick={() =>
                            setPreviewImage(
                              getImageUrl(item.realization_docs_urls[0])
                            )
                          }
                        >
                          {/* {item.realization_docs_urls.map((url, idx) => ( */}
                          <img
                            src={getImageUrl(item.realization_docs_urls[0])}
                            alt="Dokumentasi Realisasi"
                            className="h-10 w-10 rounded-md object-cover"
                          />
                          {item.realization_docs_urls.length > 1 && (
                            <span className="text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-0.5">
                              +{item.realization_docs_urls.length - 1}
                            </span>
                          )}
                          {/* ))} */}
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item.control_docs_urls?.length > 0 ? (
                        <div
                          className="flex items-center space-x-2 cursor-pointer"
                          onClick={() =>
                            setPreviewImage(
                              getImageUrl(item.control_docs_urls[0])
                            )
                          }
                        >
                          {/* {item.control_docs_urls.map((url, idx) => ( */}
                          <img
                            src={getImageUrl(item.control_docs_urls[0])}
                            alt="Dokumentasi Kontrol"
                            className="h-10 w-10 rounded-md object-cover"
                          />
                          {item.control_docs_urls.length > 1 && (
                            <span className="text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-0.5">
                              +{item.control_docs_urls.length - 1}
                            </span>
                          )}
                          {/* ))} */}
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item.creator?.name || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 text-right">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-500"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-8 text-gray-500">
                  Belum ada aktivitas pekerjaan yang dicatat.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {previewImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative bg-white rounded-lg p-2 max-w-3xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1 text-white"
              onClick={() => setPreviewImage(null)}
            >
              <X size={18} />
            </button>
            <img
              src={previewImage}
              alt="Preview"
              className="max-h-[80vh] w-auto rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkActivityLogsTable;
