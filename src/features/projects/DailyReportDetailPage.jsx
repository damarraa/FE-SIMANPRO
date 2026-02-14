import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SignatureCanvas from "react-signature-canvas";
import { Camera, X, Trash2, Eraser, FileSignature } from "lucide-react";
import {
  DocumentTextIcon,
  PhotoIcon,
  XCircleIcon,
  DocumentArrowUpIcon,
} from "@heroicons/react/24/outline";
import { updateDailyReport } from "./api/dailyReports";
import useDailyReportDetail from "../daily-reports/hooks/useDailyReportDetail";
import WorkActivityLogsTable from "./components/WorkActivityLogsTable";
import { getImageUrl } from "../../utils/image";
import { getFileUrl } from "../../utils/file";
import Swal from "sweetalert2";

const DailyReportDetailPage = () => {
  const navigate = useNavigate();
  const { id: reportId } = useParams();
  const { report, isLoading, error, refresh } = useDailyReportDetail(reportId);

  const sigPad = useRef({});

  const [formData, setFormData] = useState({
    report_date: "",
    weather: "Cerah",
    personnel_count: "",
    start_time: "", // add
    end_time: "", // add
    notes: "",
    supervisor_name: "", // add
    supervisor_position: "", // add
    pictures: [],
    attachments: [],
  });

  const [existingPictures, setExistingPictures] = useState([]);
  const [deletedPictures, setDeletedPictures] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const [existingAttachments, setExistingAttachments] = useState([]);
  const [deletedAttachments, setDeletedAttachments] = useState([]);

  const [supervisorSignaturePreview, setSupervisorSignaturePreview] =
    useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (report) {
      setFormData({
        report_date: report.report_date ? report.report_date.slice(0, 10) : "",
        weather: report.weather || "Cerah",
        personnel_count: report.personnel_count || "",
        start_time: report.start_time || "",
        end_time: report.end_time || "",
        notes: report.notes || "",
        supervisor_name: report.supervisor_name || "",
        supervisor_position: report.supervisor_position || "",
        pictures: [],
        attachments: [],
      });

      setExistingPictures(report.pictures || []);
      setDeletedPictures([]);
      setImagePreviews([]);

      setExistingAttachments(report.attachments || []);
      setDeletedAttachments([]);

      let sigPath = report.supervisor_signature;

      if (sigPath) {
        if (!sigPath.startsWith("/")) {
          sigPath = "/" + sigPath;
        }

        if (!sigPath.includes("storage/")) {
          sigPath = "/storage" + sigPath;
        }
      }

      setSupervisorSignaturePreview(getImageUrl(sigPath));
    }
  }, [report]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handlePictureChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      pictures: [...prev.pictures, ...files],
    }));

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeNewPicture = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      pictures: prev.pictures.filter((_, i) => i !== indexToRemove),
    }));
    setImagePreviews((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const removeExistingPicture = async (pictureUrlToRemove) => {
    const result = await Swal.fire({
      title: "Hapus Foto?",
      text: "Foto ini akan dihapus permanen saat Anda menyimpan perubahan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      setExistingPictures((prev) =>
        prev.filter((url) => url !== pictureUrlToRemove)
      );
      setDeletedPictures((prev) => [...prev, pictureUrlToRemove]);

      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
      });
      Toast.fire({
        icon: "info",
        title: "Foto ditandai untuk dihapus.",
      });
    }

    // setExistingPictures((prev) =>
    //   prev.filter((url) => url !== pictureUrlToRemove)
    // );
    // setDeletedPictures((prev) => [...prev, pictureUrlToRemove]);
  };

  const handleAttachmentChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...files],
    }));
  };

  const removeNewAttachment = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== indexToRemove),
    }));
  };

  const removeExistingAttachment = async (attachmentUrlToRemove) => {
    const result = await Swal.fire({
      title: "Hapus Lampiran?",
      text: "File ini akan dihapus permanen saat Anda menyimpan perubahan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      setExistingAttachments((prev) =>
        prev.filter((url) => url !== attachmentUrlToRemove)
      );
      setDeletedAttachments((prev) => [...prev, attachmentUrlToRemove]);

      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
      });
      Toast.fire({
        icon: "info",
        title: "Lampiran ditandai untuk dihapus.",
      });
    }

    // setExistingAttachments((prev) =>
    //   prev.filter((url) => url !== attachmentUrlToRemove)
    // );
    // setDeletedAttachments((prev) => [...prev, attachmentUrlToRemove]);
  };

  const clearSignature = async () => {
    if (sigPad.current && !sigPad.current.isEmpty()) {
      const result = await Swal.fire({
        title: "Hapus Tanda Tangan?",
        text: "Tanda tangan yang sedang dibuat akan dihapus.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Ya, Reset",
        cancelButtonText: "Batal",
      });

      if (result.isConfirmed) {
        sigPad.current.clear();
      }
    } else {
      sigPad.current.clear();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const submissionData = new FormData();
    submissionData.append("report_date", formData.report_date);
    submissionData.append("weather", formData.weather);
    submissionData.append("personnel_count", formData.personnel_count);
    submissionData.append("start_time", formData.start_time);
    submissionData.append("end_time", formData.end_time);
    submissionData.append("notes", formData.notes);

    submissionData.append("supervisor_name", formData.supervisor_name);
    submissionData.append("supervisor_position", formData.supervisor_position);

    if (sigPad.current && !sigPad.current.isEmpty()) {
      const sigData = sigPad.current.getCanvas().toDataURL("image/png");
      submissionData.append("supervisor_signature", sigData);
    }

    formData.pictures.forEach((file) =>
      submissionData.append("pictures[]", file)
    );

    deletedPictures.forEach((url) => {
      submissionData.append("deleted_pictures[]", url);
    });

    formData.attachments.forEach((file) =>
      submissionData.append("attachments[]", file)
    );

    deletedAttachments.forEach((url) => {
      submissionData.append("deleted_attachments[]", url);
    });

    try {
      await updateDailyReport(reportId, submissionData);
      if (sigPad.current) sigPad.current.clear();
      refresh();

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Laporan harian berhasil diperbarui.",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (err) {
      // console.error("Gagal update laporan: ", err);

      if (err.response && err.response.status === 422) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
        });
        Toast.fire({
          icon: "warning",
          title: "Mohon periksa kembali inputan Anda.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal!",
          text:
            err.response?.data?.message ||
            "Terjadi kesalahan saat menyimpan data.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="text-center p-8 text-gray-500">Loading detail laporan...</div>;
  }

  if (error || !report) {
    return (
      <div className="text-center p-8 text-red-500">
        Terjadi kesalahan saat memuat laporan.
      </div>
    );
  }

  if (!report)
    return <div className="text-center p-8">Laporan tidak ditemukan.</div>;

  const formattedDate = new Date(report.report_date).toLocaleDateString(
    "id-ID",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <div className="w-full space-y-8">
      <div className="">
        <h1 className="text-2xl font-bold text-[#0D47A1] flex items-center gap-2">
          <DocumentTextIcon className="w-6 h-6" />
          Detail Laporan Harian
        </h1>
        <p className="text-gray-600">
          Proyek:
          <span className="font-medium text-gray-800">
            {report.project?.name}
          </span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-3">
            Ringkasan Laporan
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Laporan
              </label>
              <input
                type="date"
                id="report_date"
                name="report_date"
                value={formData.report_date}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cuaca
              </label>
              <select
                id="weather"
                name="weather"
                value={formData.weather}
                onChange={handleChange}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Cerah">Cerah</option>
                <option value="Berawan">Berawan</option>
                <option value="Hujan">Hujan</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jumlah Petugas
              </label>
              <input
                type="number"
                id="personnel_count"
                name="personnel_count"
                value={formData.personnel_count}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Waktu Mulai
              </label>
              <input
                type="time"
                name="start_time"
                id="start_time"
                value={formData.start_time}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Waktu Selesai
              </label>
              <input
                type="time"
                name="end_time"
                id="end_time"
                value={formData.end_time}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-sm text-gray-500">Dibuat Oleh</label>
              <p className="font-semibold text-gray-800 mt-2">
                {report.submitted_by?.name || "-"}
              </p>
            </div>
            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catatan
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-4 flex items-center gap-2 border-b pb-3">
            <FileSignature className="w-5 h-5 text-blue-600" />
            Validasi Pengawas Lapangan
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Pengawas
              </label>
              <input
                type="text"
                name="supervisor_name"
                value={formData.supervisor_name}
                onChange={handleChange}
                placeholder="Nama lengkap pengawas"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jabatan
              </label>
              <input
                type="text"
                name="supervisor_position"
                value={formData.supervisor_position}
                onChange={handleChange}
                placeholder="Contoh: Site Manager / Supervisor"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Kolom Kiri: Preview Tanda Tangan Lama */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col items-center justify-center min-h-[160px]">
              <p className="text-xs font-medium text-gray-500 mb-3">
                Tanda Tangan Tersimpan
              </p>
              {supervisorSignaturePreview ? (
                <img
                  src={supervisorSignaturePreview}
                  alt="Signature"
                  className="max-h-24 object-contain"
                />
              ) : (
                <span className="text-sm text-gray-400 italic">
                  Belum ada tanda tangan
                </span>
              )}
            </div>

            {/* Kolom Kanan: Canvas Baru */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs font-medium text-gray-700">
                  Update Tanda Tangan
                </p>
                <button
                  type="button"
                  onClick={clearSignature}
                  className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1"
                >
                  <Eraser className="w-3 h-3" /> Reset
                </button>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg bg-white overflow-hidden relative hover:border-blue-400 transition-colors">
                <SignatureCanvas
                  ref={sigPad}
                  penColor="black"
                  canvasProps={{
                    className: "w-full h-40 cursor-crosshair",
                    width: 500, // Width internal canvas (resolusi)
                    height: 160,
                  }}
                />
                <div className="absolute bottom-2 left-2 pointer-events-none">
                  <span className="text-[10px] text-gray-400 bg-white/80 px-1 rounded">
                    Area Tanda Tangan
                  </span>
                </div>
              </div>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-4 mt-4 border-t">
            Dokumentasi Briefing Pagi
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {existingPictures.map((picUrl, index) => (
              <div key={index} className="relative group">
                <img
                  src={getImageUrl(picUrl)}
                  alt="Dokumentasi"
                  className="h-28 w-full object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => removeExistingPicture(picUrl)}
                  className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full opacity-75 group-hover:opacity-100 transition-all hover:scale-110"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview}
                  alt="Preview"
                  className="h-28 w-full object-cover rounded-md border-2 border-blue-400"
                />
                <button
                  type="button"
                  onClick={() => removeNewPicture(index)}
                  className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full opacity-75 group-hover:opacity-100 transition-all hover:scale-110"
                >
                  <XCircleIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-center p-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="text-center">
              <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
              <label
                htmlFor="pictures"
                className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-500 cursor-pointer"
              >
                Klik untuk menambah foto
                <input
                  id="pictures"
                  name="pictures"
                  type="file"
                  className="sr-only"
                  multiple
                  onChange={handlePictureChange}
                  accept="image/*"
                />
              </label>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-4 mt-4 border-t">
            Working Permit/Lampiran File (PDF, Gambar, dll)
          </h3>
          <div className="space-y-3">
            {existingAttachments.map((fileUrl, index) => (
              <div
                key={`existing-att-${index}`}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-md border"
              >
                <a
                  href={getFileUrl(fileUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-blue-600 hover:underline truncate flex items-center gap-2"
                  title="Klik untuk melihat file"
                >
                  {fileUrl.split("/").pop()}
                </a>
                <button
                  type="button"
                  onClick={() => removeExistingAttachment(fileUrl)}
                  className="ml-4 p-1 text-red-600 hover:text-red-800 rounded-full"
                  title="Hapus file"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            {formData.attachments.map((file, index) => (
              <div
                key={`new-att-${index}`}
                className="flex items-center justify-between p-3 bg-blue-50 rounded-md border border-blue-300"
              >
                <span className="text-sm font-medium text-gray-800 truncate">
                  {file.name}
                </span>
                <button
                  type="button"
                  onClick={() => removeNewAttachment(index)}
                  className="ml-4 p-1 text-red-600 hover:text-red-800 rounded-full"
                  title="Batal upload"
                >
                  <XCircleIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-center p-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="text-center">
              <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
              <label
                htmlFor="attachments"
                className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-500 cursor-pointer"
              >
                Klik untuk menambah lampiran (PDF, Gambar)
                <input
                  type="file"
                  name="attachments"
                  id="attachments"
                  className="sr-only"
                  multiple
                  onChange={handleAttachmentChange}
                  accept=".pdf,image/*"
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={() => navigate(`/projects/${report.project.id}`)}
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg"
            >
              Kembali
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </div>
      </form>

      {/* Tabel untuk mengelola log aktivitas pekerjaan */}
      <WorkActivityLogsTable
        // activities={report.activities}
        activities={report.activities || []}
        onDataUpdate={refresh}
        projectId={report.project?.id}
      />

      {previewImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setPreviewImage(null)}
        >
          <button
            className="absolute top-4 right-4 bg-white rounded-full p-1 text-gray-800 hover:scale-110 transition-transform"
            onClick={() => setPreviewImage(null)}
          >
            <X size={24} />
          </button>

          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <img
              src={previewImage}
              alt="Preview"
              className="max-h-[90vh] max-w-[90vw] w-auto h-auto rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyReportDetailPage;
