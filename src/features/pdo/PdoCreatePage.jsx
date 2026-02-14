import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import usePdo from "./hooks/usePdo";
import useProjects from "../projects/hooks/useProjects";
import {
  ArrowLeftIcon,
  CalculatorIcon,
  PlusIcon,
  TrashIcon,
  PaperClipIcon,
  XMarkIcon,
  DocumentTextIcon,
  MagnifyingGlassPlusIcon,
} from "@heroicons/react/24/outline";

const PdoCreatePage = () => {
  const navigate = useNavigate();
  const { createPdo, isLoading: isPdoLoading } = usePdo();

  const {
    projects,
    isLoading: isProjectsLoading,
    setSearchTerm,
  } = useProjects();

  const [formData, setFormData] = useState({
    tgl_pdo: new Date().toISOString().split("T")[0],
    project_id: "",
  });

  const [items, setItems] = useState([
    { uraian: "", volume: "", satuan: "", harga_satuan: "" },
  ]);

  const [evidenFiles, setEvidenFiles] = useState([]);
  const [estimatedTotal, setEstimatedTotal] = useState(0);

  const [zoomedFile, setZoomedFile] = useState(null);
  const fileUrlsRef = useRef([]);

  useEffect(() => {
    fileUrlsRef.current = evidenFiles.map((f) => f.preview);
  }, [evidenFiles]);

  useEffect(() => {
    return () => {
      fileUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const toTitleCase = (str) => {
    if (!str) return "";
    return str.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  };

  const formatIDR = (value) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);

  useEffect(() => {
    const total = items.reduce((acc, item) => {
      const vol = parseFloat(item.volume) || 0;
      const price = parseFloat(item.harga_satuan) || 0;
      return acc + vol * price;
    }, 0);
    setEstimatedTotal(total);
  }, [items]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        file: file,
        preview: URL.createObjectURL(file),
        type: file.type,
        name: file.name,
      }));
      setEvidenFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (indexToRemove) => {
    setEvidenFiles((prev) => {
      const targetFile = prev[indexToRemove];
      if (targetFile) URL.revokeObjectURL(targetFile.preview);
      return prev.filter((_, index) => index !== indexToRemove);
    });
  };

  const handlePreviewClick = (fileObj) => {
    setZoomedFile({
      url: fileObj.preview,
      type: fileObj.type,
    });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleItemBlur = (index, field) => {
    const newItems = [...items];
    const currentValue = newItems[index][field];

    if (currentValue) {
      newItems[index][field] = toTitleCase(currentValue);
      setItems(newItems);
    }
  };

  const addItem = () => {
    setItems([
      ...items,
      { uraian: "", volume: "", satuan: "", harga_satuan: "" },
    ]);
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();
    payload.append("tgl_pdo", formData.tgl_pdo);
    payload.append("project_id", formData.project_id);

    if (evidenFiles.length > 0) {
      evidenFiles.forEach((fileObj) => {
        payload.append("eviden_bon[]", fileObj.file);
      });
    }

    items.forEach((item, index) => {
      payload.append(`items[${index}][uraian]`, toTitleCase(item.uraian));
      payload.append(`items[${index}][volume]`, parseFloat(item.volume));
      payload.append(`items[${index}][satuan]`, item.satuan);
      payload.append(
        `items[${index}][harga_satuan]`,
        parseFloat(item.harga_satuan)
      );
    });

    const success = await createPdo(payload);
    if (success) {
      navigate("/pdos");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6 flex items-center gap-4">
        <Link
          to="/pdos"
          className="p-2 rounded-full hover:bg-gray-200 transition-colors"
        >
          <ArrowLeftIcon className="w-6 h-6 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Buat Pengajuan PDO
          </h1>
          <p className="text-sm text-gray-700">
            Isi formulir untuk mengajukan biaya operasional proyek.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
              Informasi Umum
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="tgl_pdo"
                  value={formData.tgl_pdo}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pilih Project <span className="text-red-500">*</span>
                </label>
                <select
                  name="project_id"
                  value={formData.project_id}
                  onChange={handleChange}
                  disabled={isProjectsLoading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  required
                >
                  <option value="">
                    {isProjectsLoading
                      ? "Memuat Project..."
                      : "-- Pilih Project --"}
                  </option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.job_name} ({p.contract_number})
                    </option>
                  ))}
                </select>
                {projects.length === 0 && !isProjectsLoading && (
                  <p className="text-xs text-red-500 mt-1">
                    Tidak ada project ditemukan. Pastikan Anda ditugaskan ke
                    project.
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Bukti Bon/Nota (Opsional)
                </label>
                <div className="flex flex-col gap-2 mb-4">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <PaperClipIcon className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="mb-1 text-sm text-gray-500">
                        <span className="font-semibold">Klik untuk upload</span>{" "}
                        atau drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        JPG, PNG, PDF (Maks. 5MB/file)
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      multiple
                      accept=".jpg,.jpeg,.png,.webp,.pdf"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>

                {evidenFiles.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {evidenFiles.map((fileObj, idx) => (
                      <div
                        key={idx}
                        className="relative group border rounded-lg overflow-hidden bg-gray-100 aspect-square shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handlePreviewClick(fileObj)}
                      >
                        {fileObj.type.startsWith("image/") ? (
                          <div className="w-full h-full relative">
                            <img
                              src={fileObj.preview}
                              alt={`Preview ${idx}`}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 transition-opacity pointer-events-none">
                              <MagnifyingGlassPlusIcon className="w-8 h-8 text-white drop-shadow-md" />
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center bg-gray-50 hover:bg-gray-200 transition-colors">
                            <DocumentTextIcon className="w-10 h-10 text-red-500 mb-1" />
                            <span className="text-[10px] text-gray-600 break-all line-clamp-2 px-1">
                              {fileObj.name}
                            </span>
                            <span className="text-[9px] text-gray-400 mt-1 uppercase font-semibold">
                              Klik untuk Preview
                            </span>
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(idx);
                          }}
                          className="absolute top-1 right-1 bg-white/90 text-red-500 p-1 rounded-full hover:bg-red-500 hover:text-white shadow-sm border border-gray-200 transition-all z-10"
                          title="Hapus file"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>

                        <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded backdrop-blur-sm pointer-events-none">
                          #{idx + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h2 className="text-lg font-semibold text-gray-900">
                Rincian Biaya
              </h2>
              <button
                type="button"
                onClick={addItem}
                className="text-sm flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
              >
                <PlusIcon className="w-4 h-4" /> Tambah Item
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end bg-gray-50 p-4 rounded-lg border border-gray-200"
                >
                  <div className="md:col-span-5">
                    <label className="block text-xs font-medium text-gray-800 mb-1">
                      Uraian
                    </label>
                    <input
                      type="text"
                      value={item.uraian}
                      onChange={(e) =>
                        handleItemChange(index, "uraian", e.target.value)
                      }
                      onBlur={() => handleItemBlur(index, "uraian")}
                      placeholder="Contoh: Makan Siang / Material Kabel"
                      className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 text-sm"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-800 mb-1">
                      Volume
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={item.volume}
                      onChange={(e) =>
                        handleItemChange(index, "volume", e.target.value)
                      }
                      placeholder="0"
                      className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 text-sm"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-800 mb-1">
                      Satuan
                    </label>
                    <input
                      type="text"
                      value={item.satuan}
                      onChange={(e) =>
                        handleItemChange(index, "satuan", e.target.value)
                      }
                      placeholder="Pcs/Set/Mtr"
                      className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 text-sm"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-800 mb-1">
                      Harga Satuan
                    </label>
                    <input
                      type="number"
                      value={item.harga_satuan}
                      onChange={(e) =>
                        handleItemChange(index, "harga_satuan", e.target.value)
                      }
                      placeholder="Rp"
                      className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 text-sm"
                      required
                    />
                  </div>
                  <div className="md:col-span-1 flex justify-center pb-1">
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      disabled={items.length === 1}
                      className="text-red-500 hover:text-red-700 disabled:opacity-30 transition-colors"
                      title="Hapus Baris"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CalculatorIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-900 font-medium">
                    Total Estimasi
                  </p>
                  <p className="text-xs text-gray-800">
                    Kalkulasi otomatis dari item di atas
                  </p>
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-700">
                {formatIDR(estimatedTotal)}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Link
              to="/pdos"
              className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={isPdoLoading}
              className={`px-6 py-2.5 rounded-lg text-white font-medium transition-colors ${
                isPdoLoading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
              }`}
            >
              {isPdoLoading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Menyimpan...
                </span>
              ) : (
                "Simpan Pengajuan"
              )}
            </button>
          </div>
        </form>
      </div>

      {zoomedFile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 transition-opacity duration-300"
          onClick={() => setZoomedFile(null)}
        >
          <div className="relative max-w-5xl w-full h-[90vh] flex items-center justify-center">
            <button
              onClick={() => setZoomedFile(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors z-50"
            >
              <XMarkIcon className="w-8 h-8" />
            </button>

            {zoomedFile.type.startsWith("image/") ? (
              <img
                src={zoomedFile.url}
                alt="Zoomed Evidence"
                className="max-h-full max-w-full object-contain rounded-lg shadow-2xl border border-gray-700"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <iframe
                src={zoomedFile.url}
                title="PDF Preview"
                className="w-full h-full rounded-lg shadow-2xl border border-gray-700 bg-white"
                onClick={(e) => e.stopPropagation()}
              />
            )}

            <p className="absolute -bottom-8 text-white/70 text-sm">
              Klik di luar area untuk menutup
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PdoCreatePage;
