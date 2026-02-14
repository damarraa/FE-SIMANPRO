import React, { useState } from "react";
import api from "../../api";
import { useNavigate, useParams } from "react-router-dom";
import {
  DocumentTextIcon,
  PhotoIcon,
  XCircleIcon,
  DocumentArrowUpIcon,
} from "@heroicons/react/24/outline";

const DailyReportCreatePage = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const [formData, setFormData] = useState({
    report_date: new Date().toISOString().slice(0, 10),
    weather: "Cerah",
    personnel_count: "",
    start_time: "",
    end_time: "",
    notes: "",
    pictures: [],
    attachments: [],
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handlePictureChange = (e) => {
    const files = Array.from(e.target.files);

    if (formData.pictures.length + files.length > 4) {
      alert("Anda hanya bisa mengunggah maksimal 4 foto.");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      pictures: [...prev.pictures, ...files],
    }));

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removePicture = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      pictures: prev.pictures.filter((_, index) => index !== indexToRemove),
    }));
    setImagePreviews((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleAttachmentChange = (e) => {
    const files = Array.from(e.target.files);

    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...files],
    }));
  };

  const removeAttachment = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter(
        (_, index) => index !== indexToRemove
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const submissionData = new FormData();
    submissionData.append("report_date", formData.report_date);
    submissionData.append("weather", formData.weather);
    submissionData.append("personnel_count", formData.personnel_count);
    submissionData.append("start_time", formData.start_time);
    submissionData.append("end_time", formData.end_time);
    submissionData.append("notes", formData.notes);

    if (formData.pictures.length > 0) {
      formData.pictures.forEach((pictureFile) => {
        submissionData.append("pictures[]", pictureFile);
      });
    }

    if (formData.attachments.length > 0) {
      formData.attachments.forEach((file) => {
        submissionData.append("attachments[]", file);
      });
    }

    try {
      await api.post(
        `/v1/projects/${projectId}/daily-reports`,
        submissionData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      navigate(`/projects/${projectId}`, {
        state: { message: "Laporan harian berhasil dibuat!" },
      });
    } catch (err) {
      if (err.response?.status === 422) {
        console.log("Validation Error: ", err.response.data.errors);
        setErrors(err.response.data.errors);
      } else {
        setErrors({ general: "Gagal menyimpan data." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold text-[#0D47A1] mb-8 flex items-center gap-2">
        <DocumentTextIcon className="w-6 h-6" />
        Tambah Laporan Harian Baru
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="">
              <label
                htmlFor="report_date"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tanggal Laporan
              </label>
              <input
                type="date"
                name="report_date"
                id="report_date"
                value={formData.report_date}
                onChange={handleChange}
                required
                className="mt-1 block w-full text-gray-900 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.report_date && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.report_date[0]}
                </p>
              )}
            </div>

            <div className="">
              <label
                htmlFor="weather"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Cuaca
              </label>
              <select
                name="weather"
                id="weather"
                value={formData.weather}
                onChange={handleChange}
                required
                className="mt-1 block w-full text-gray-900 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Cerah">Cerah</option>
                <option value="Berawan">Berawan</option>
                <option value="Hujan">Hujan</option>
              </select>
            </div>

            <div className="">
              <label
                htmlFor="personnel_count"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Jumlah Petugas
              </label>
              <input
                type="number"
                name="personnel_count"
                id="personnel_count"
                value={formData.personnel_count}
                onChange={handleChange}
                required
                className="mt-1 block w-full text-gray-900 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.personnel_count && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.personnel_count[0]}
                </p>
              )}
            </div>
          </div>

          <div className="">
            <label
              htmlFor="start_time"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Waktu Mulai
            </label>
            <input
              type="time"
              name="start_time"
              id="start_time"
              value={formData.start_time}
              onChange={handleChange}
              required
              className="mt-1 block w-full text-gray-900 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.start_time && (
              <p className="text-red-500 text-xs mt-1">
                {errors.start_time[0]}
              </p>
            )}
          </div>

          <div className="">
            <label
              htmlFor="end_time"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Waktu Selesai
            </label>
            <input
              type="time"
              name="end_time"
              id="end_time"
              value={formData.end_time}
              onChange={handleChange}
              required
              className="mt-1 block w-full text-gray-900 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.end_time && (
              <p className="text-red-500 text-xs mt-1">{errors.end_time[0]}</p>
            )}
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dokumentasi Briefing Pagi (Maks. 2MB/Foto)
            </label>
            <div className="mt-2 flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="pictures"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                  >
                    <span>Unggah File</span>
                    <input
                      type="file"
                      id="pictures"
                      name="pictures"
                      className="sr-only"
                      multiple
                      onChange={handlePictureChange}
                      accept="image/jpeg,image/png,image/webp"
                    />
                  </label>
                  <p className="pl-1">atau tarik dan lepas</p>
                </div>
              </div>
            </div>
            {errors.pictures && (
              <p className="text-red-500 text-xs mt-1">{errors.pictures[0]}</p>
            )}
            {errors["pictures.0"] && (
              <p className="text-red-500 text-xs mt-1">
                Salah satu file gambar tidak valid.
              </p>
            )}

            {/* Tampilkan Preview Gambar */}
            {imagePreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {imagePreviews.map((previewUrl, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={previewUrl}
                      alt={`Preview ${index + 1}`}
                      className="h-28 w-full object-cover rounded-md"
                    />
                    <div className="absolute top-0 right-0">
                      <button
                        type="button"
                        onClick={() => removePicture(index)}
                        className="p-1 bg-red-500 text-white rounded-full opacity-75 group-hover:opacity-100 transition-opacity"
                      >
                        <XCircleIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Working Permit / Dokumen (PDF / Gambar, Maks. 2MB/File)
            </label>
            {formData.attachments.length > 0 && (
              <div className="mb-4 space-y-2">
                {formData.attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-md"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <DocumentArrowUpIcon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <span className="text-sm text-gray-700 truncate">
                        {file.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({(file.size / 1024).toFixed(0)} KB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <XCircleIcon className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Box Upload */}
            <div className="mt-2 flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:bg-gray-50 transition-colors">
              <div className="space-y-1 text-center">
                <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600 justify-center">
                  <label
                    htmlFor="attachments"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                  >
                    <span>Unggah Working Permit / Dokumen</span>
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
                  <p className="pl-1">PDF atau Gambar</p>
                </div>
              </div>
            </div>
            {errors.attachments && (
              <p className="text-red-500 text-xs mt-1">
                {errors.attachments[0]}
              </p>
            )}
          </div>

          <div className="mt-6">
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Catatan
            </label>
            <textarea
              name="notes"
              id="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              className="mt-1 block w-full text-gray-900 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>

          <div className="flex justify-end gap-4 mt-6 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate(`/projects/${projectId}`)}
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className=" bg-[#2196F3] text-white px-6 py-2 rounded-lg disabled:bg-gray-400"
            >
              {loading ? "Menyimpan..." : "Simpan Laporan"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DailyReportCreatePage;
