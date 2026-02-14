import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getImageUrl } from "../../../utils/image";
import {
  Plus,
  Edit,
  Camera,
  XCircle,
  Trash2,
  Download,
  ChevronDown,
  X,
  Calendar,
} from "lucide-react";
import { deleteDailyReport } from "../api/dailyReports";
import api from "../../../api";
import Swal from "sweetalert2";

const DailyReportsTable = ({
  reports = [],
  isLoading,
  onDataUpdate,
  projectId,
}) => {
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    setSelectedIds(e.target.checked ? reports.map((r) => r.id) : []);
  };

  const isAllSelected =
    reports.length > 0 && selectedIds.length === reports.length;

  useEffect(() => {
    setSelectedIds([]);
  }, [reports]);

  const handleDelete = async (reportId) => {
    const result = await Swal.fire({
      title: "Hapus Laporan?",
      text: "Laporan yang dihapus tidak dapat dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await deleteDailyReport(reportId);
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
        });
        Toast.fire({
          icon: "success",
          title: "Laporan berhasil dihapus.",
        });

        onDataUpdate();
      } catch (error) {
        console.error("Gagal menghapus laporan harian: ", error);
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: "Terjadi kesalahan saat menghapus data.",
        });
      }
    }

    // if (
    //   window.confirm("Apakah Anda yakin ingin menghapus laporan harian ini?")
    // ) {
    //   try {
    //     await deleteDailyReport(reportId);
    //     onDataUpdate();
    //   } catch (error) {
    //     console.error("Gagal menghapus laporan harian: ", error);
    //   }
    // }
  };

  const handleExport = async (type) => {
    setShowExportMenu(false);

    if (!projectId) {
      // console.error("Project ID tidak ditemukan, tidak bisa ekspor.");
      Swal.fire("Error", "Project ID tidak ditemukan.", error);
      return;
    }

    if ((dateFrom && !dateTo) || (!dateFrom && dateTo)) {
      // alert(
      //   "Harap isi kedua filter 'Dari Tanggal' dan 'Sampai Tanggal' untuk memfilter."
      // );
      Swal.fire({
        icon: "warning",
        title: "Filter Belum Lengkap",
        text: "Harap isi kedua filter 'Dari Tanggal' dan 'Sampai Tanggal'.",
      });
      return;
    }

    setIsExporting(true);
    Swal.fire({
      title: "Mengekspor Data...",
      text: "Mohon tunggu, sedang membuat file.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const params = new URLSearchParams();
    params.append("type", type);

    if (dateFrom && dateTo) {
      params.append("date_from", dateFrom);
      params.append("date_to", dateTo);
    }

    try {
      const response = await api.get(
        `/v1/projects/${projectId}/daily-reports/export?${params.toString()}`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      const fileExtension = type === "pdf" ? "pdf" : "xlsx";
      const dateString = dateFrom ? `${dateFrom}_sd_${dateTo}` : "semua";

      link.href = url;
      link.setAttribute(
        "download",
        `laporan-harian-${dateString}.${fileExtension}`
      );

      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      Swal.close();
    } catch (error) {
      // console.error("Gagal mengekspor data: ", error);
      Swal.fire("Gagal", "Gagal mengunduh file export.", "error");
    } finally {
      setIsExporting(false);
    }
  };

  const handleSelectedExport = async () => {
    if (selectedIds.length === 0) return;

    setIsExporting(true);
    const params = new URLSearchParams();
    params.append("type", "pdf");
    selectedIds.forEach((id) => params.append("ids[]", id));

    try {
      const response = await api.get(
        `/v1/projects/${projectId}/daily-reports/export?${params.toString()}`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `laporan-terpilih-${selectedIds.length}-item.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Gagal mengekspor data terpilih:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDateExport = async (preset = null) => {
    setShowExportMenu(false);
    if (!projectId) return;

    let from = dateFrom;
    let to = dateTo;
    let exportName = "custom";
    let reportFormat = "daily_log";

    if (preset) {
      const today = new Date();
      if (preset === "this_week") {
        const currentDay = today.getDay();
        const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay;

        const firstDay = new Date(today);
        firstDay.setDate(today.getDate() + diffToMonday);

        const lastDay = new Date(firstDay);
        lastDay.setDate(firstDay.getDate() + 6);

        from = firstDay.toISOString().split("T")[0];
        to = lastDay.toISOString().split("T")[0];

        exportName = "mingguan_progress";
        reportFormat = "weekly_recap";
      } else if (preset === "this_month") {
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        from = firstDay.toISOString().split("T")[0];
        to = lastDay.toISOString().split("T")[0];

        exportName = "bulanan";
        reportFormat = "monthly_recap";
      }

      setDateFrom(from);
      setDateTo(to);
    }

    if (!preset && ((from && !to) || (!from && to))) {
      // alert("Harap isi 'Dari Tanggal' dan 'Sampai Tanggal' dengan lengkap.");
      Swal.fire({
        icon: "warning",
        title: "Filter Belum Lengkap",
        text: "Harap isi 'Dari Tanggal' dan 'Sampai Tanggal' dengan lengkap.",
      });
      return;
    }

    setIsExporting(true);
    Swal.fire({
      title: "Mengekspor Laporan...",
      text: "Sedang menyusun data PDF.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const params = new URLSearchParams();
    params.append("type", "pdf");
    params.append("report_format", reportFormat);

    if (from && to) {
      params.append("date_from", from);
      params.append("date_to", to);
      if (reportFormat !== "weekly_recap") {
        exportName = `${from}_sd_${to}`;
      }
    } else {
      exportName = "semua-waktu";
    }

    try {
      const response = await api.get(
        `/v1/projects/${projectId}/daily-reports/export?${params.toString()}`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `laporan-${exportName}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      Swal.close();
    } catch (error) {
      // console.error("gagal mengekspor data: ", error);
      Swal.fire("Gagal", "Gagal mengunduh file export.", "error");
    } finally {
      setIsExporting(false);
    }
  };

  const clearDateFilters = () => {
    setDateFrom("");
    setDateTo("");
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <div className="">
          <h3 className="text-lg font-semibold text-gray-800">
            Laporan Harian
          </h3>
          {selectedIds.length > 0 && (
            <span className="text-sm font-medium text-blue-600">
              {selectedIds.length} laporan dipilih
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div>
            <label
              htmlFor="date_from"
              className="block text-xs font-medium text-gray-600 mb-1"
            >
              Dari Tanggal
            </label>
            <input
              type="date"
              name="date_from"
              id="date_from"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="text-gray-700 border-gray-300 rounded-md shadow-sm text-sm p-2 h-10"
            />
          </div>
          <div>
            <label
              htmlFor="date_to"
              className="block text-xs font-medium text-gray-600 mb-1"
            >
              Sampai Tanggal
            </label>
            <input
              type="date"
              name="date_to"
              id="date_to"
              value={dateTo}
              min={dateFrom}
              onChange={(e) => setDateTo(e.target.value)}
              className="text-gray-700 border-gray-300 rounded-md shadow-sm text-sm p-2 h-10"
            />
          </div>

          <div className="border-l border-gray-300 h-10 mx-2"></div>

          <button
            onClick={clearDateFilters}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 p-2 h-10"
            title="Reset Filter"
          >
            <XCircle size={14} />
          </button>

          <div className="border-l border-gray-300 h-10 mx-2"></div>
          {selectedIds.length > 0 ? (
            <button
              onClick={handleSelectedExport}
              disabled={isExporting}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 h-10"
            >
              <Download size={16} />
              {isExporting
                ? "Mengekspor..."
                : `Export ${selectedIds.length} Pilihan`}
            </button>
          ) : (
            <>
              <button
                onClick={() => handleDateExport()}
                disabled={isExporting || (!dateFrom && !dateTo)}
                className="text-sm bg-gray-100 text-gray-800 hover:bg-gray-200 flex items-center gap-2 p-2 h-10 rounded-md disabled:opacity-50"
                title="Ekspor Sesuai Tanggal Custom"
              >
                <Calendar size={16} />
                Export Custom
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  disabled={isExporting || reports.length === 0}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg text-sm flex items-center gap-2 h-10 disabled:opacity-50"
                >
                  <Download size={16} />
                  Export Preset
                  <ChevronDown size={16} />
                </button>
                {showExportMenu && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border"
                    onMouseLeave={() => setShowExportMenu(false)}
                  >
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDateExport("this_week");
                      }}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Export Minggu Ini
                    </a>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDateExport("this_month");
                      }}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Export Bulan Ini
                    </a>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDateExport(null);
                      }}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Export Semua Waktu
                    </a>
                  </div>
                )}
              </div>
            </>
          )}

          <button
            onClick={() => navigate("daily-reports/create")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 h-10"
          >
            <Plus size={16} /> Tambah Laporan
          </button>
        </div>
      </div>

      {isLoading && (
        <p className="text-center text-gray-500 py-8">
          Loading laporan harian...
        </p>
      )}

      {!isLoading && reports.length === 0 && (
        <div className="text-center text-gray-500 py-8 bg-white rounded-xl border border-dashed border-gray-300">
          Belum ada laporan harian. Klik "Tambah Laporan" untuk memulai.
        </div>
      )}

      {!isLoading && reports.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Dokumentasi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Tanggal Laporan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Cuaca
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Jumlah Petugas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Dibuat Oleh
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reports.map((item) => (
                <tr
                  key={item.id}
                  className={
                    selectedIds.includes(item.id)
                      ? "bg-blue-50"
                      : "hover:bg-gray-50"
                  }
                >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => handleSelect(item.id)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    {item.pictures && item.pictures.length > 0 ? (
                      <div
                        className="flex items-center space-x-2 cursor-pointer"
                        onClick={() =>
                          setPreviewImage(getImageUrl(item.pictures[0]))
                        }
                      >
                        <img
                          src={getImageUrl(item.pictures[0])}
                          alt="Dokumentasi Laporan"
                          className="h-10 w-10 rounded-md object-cover"
                        />
                        {item.pictures.length > 1 && (
                          <span className="text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-0.5">
                            +{item.pictures.length - 1}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center text-gray-400">
                        <Camera size={18} className="mr-2" />
                        <span className="text-xs">Tidak Ada</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {new Date(item.report_date).toLocaleDateString("id-ID")}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {item.weather}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {item.personnel_count}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {item.submitted_by?.name || "-"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => navigate(`/daily-reports/${item.id}`)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit Laporan"
                    >
                      <Edit size={18} />
                    </button>

                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(item.id)}
                      title="Hapus Laporan"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
              className="max-hh-[80vh] w-auto rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyReportsTable;
