import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import usePdo from "./hooks/usePdo";
import { approveFinance } from "./api";
import Swal from "sweetalert2";
import { useAuthStore } from "../../store/authStore";
import api, { ASSET_BASE_URL } from "../../api";
import {
  ArrowLeftIcon,
  PrinterIcon,
  BanknotesIcon,
  BriefcaseIcon,
  UserIcon,
  DocumentCheckIcon,
  PaperClipIcon,
  XCircleIcon,
  XMarkIcon,
  DocumentTextIcon,
  MagnifyingGlassPlusIcon,
} from "@heroicons/react/24/outline";

const PdoDetailPage = () => {
  const { id } = useParams();
  const { fetchDetail, pdoDetail, isLoading } = usePdo();
  const [isExporting, setIsExporting] = useState(false);
  const [rejectedItemIds, setRejectedItemIds] = useState([]);

  const [zoomedFile, setZoomedFile] = useState(null);

  const user = useAuthStore((state) => state.user);
  const firstRole = user?.roles?.[0];
  const userRole =
    (typeof firstRole === "object" ? firstRole?.name : firstRole) || "Guest";

  const hasFullAccess = [
    "Finance",
    "Logistic",
    "Admin",
    "Super Admin",
  ].includes(userRole);

  const isFinancePending = userRole === "Finance" && !pdoDetail?.pemeriksa_id;

  useEffect(() => {
    fetchDetail(id);
  }, [id, fetchDetail]);

  useEffect(() => {
    setRejectedItemIds([]);
  }, [pdoDetail]);

  const formatIDR = (value) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value || 0);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const approvedTotal = useMemo(() => {
    if (!pdoDetail?.items) return 0;
    return pdoDetail.items.reduce((acc, item) => {
      const isRejected =
        item.status === "REJECTED" || rejectedItemIds.includes(item.id);

      if (isRejected) return acc;
      return acc + parseFloat(item.jumlah);
    }, 0);
  }, [pdoDetail, rejectedItemIds]);

  const originalTotal = useMemo(() => {
    if (!pdoDetail?.items) return 0;
    return pdoDetail.items.reduce(
      (acc, item) => acc + parseFloat(item.jumlah),
      0
    );
  }, [pdoDetail]);

  const evidenList = useMemo(() => {
    if (!pdoDetail?.eviden_bon_path) return [];
    try {
      const parsed = JSON.parse(pdoDetail.eviden_bon_path);
      if (Array.isArray(parsed)) {
        return parsed.map((path) => ({
          url: `${ASSET_BASE_URL}/storage/${path}`,
          type: path.toLowerCase().endsWith(".pdf")
            ? "application/pdf"
            : "image/jpeg",
          name: path.split("/").pop(),
        }));
      }
    } catch (e) {
      console.error("Error Response: ", e);
    }

    return [
      {
        url: `${ASSET_BASE_URL}/storage/${pdoDetail.eviden_bon_path}`,
        type: pdoDetail.eviden_bon_path.toLowerCase().endsWith(".pdf")
          ? "application/pdf"
          : "image/jpeg",
        name: pdoDetail.eviden_bon_path.split("/").pop(),
      },
    ];
  }, [pdoDetail]);

  const toggleRejectItem = (itemId) => {
    setRejectedItemIds((prev) => {
      if (prev.includes(itemId)) {
        return prev.filter((id) => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  const getStatusBadge = (pdo) => {
    if (pdo.pemeriksa_id) return "bg-green-100 text-green-800 border-green-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getStatusLabel = (pdo) => {
    if (pdo.pemeriksa_id) return "Approved";
    return "Draft";
  };

  const handleExportPdf = async () => {
    setIsExporting(true);
    try {
      const response = await api.get(`/v2/pdos/${id}/export`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      const fileName = pdoDetail?.no_pdo
        ? `${pdoDetail.no_pdo}.pdf`
        : "PDO-Export.pdf";
      link.setAttribute("download", fileName);

      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export PDF Error:", error);
      Swal.fire("Gagal", "Gagal mengunduh PDF. Silakan coba lagi.", "error");
    } finally {
      setIsExporting(false);
    }
  };

  const handleApproveFinance = async () => {
    try {
      const rejectionNote =
        rejectedItemIds.length > 0
          ? `Anda akan menolak ${rejectedItemIds.length} item.`
          : "Semua item disetujui.";

      const result = await Swal.fire({
        title: "Konfirmasi Pemeriksaan",
        html: `
          <p class="mb-2">Apakah Anda yakin menyetujui pengajuan ini?</p>
          <p class="text-sm text-red-600 font-bold">${rejectionNote}</p>
          <p class="text-xs text-gray-500 mt-2">Total Cair: ${formatIDR(
            approvedTotal
          )}</p>
        `,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, Approve",
        confirmButtonColor: "#3085d6",
        cancelButtonText: "Batal",
      });

      if (result.isConfirmed) {
        await approveFinance(id, { rejected_item_ids: rejectedItemIds });
        Swal.fire("Sukses", "PDO berhasil disetujui.", "success");
        fetchDetail(id);
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Gagal", "Terjadi kesalahan saat approval.", "error");
    }
  };

  const renderSignature = (userData, label) => {
    if (!userData)
      return (
        <p className="text-sm text-gray-400 italic mb-3">Menunggu {label}...</p>
      );

    if (userData.signature) {
      const sigUrl = userData.signature.startsWith("http")
        ? userData.signature
        : `${ASSET_BASE_URL}${userData.signature}`;

      return (
        <div className="mb-2">
          <img
            src={sigUrl}
            alt={`Signature ${label}`}
            className="h-16 object-contain opacity-90"
          />
          <p className="text-xs text-gray-500 mt-1 font-medium">
            {userData.name}
          </p>
          <p className="text-[10px] text-gray-400">
            {userData.job_title || label}
          </p>
        </div>
      );
    } else {
      return (
        <div className="mb-2 py-4">
          <p className="text-xs text-red-400 italic font-medium">
            (Tanda tangan digital belum diatur)
          </p>
          <p className="text-xs text-gray-500 mt-1">{userData.name}</p>
        </div>
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        <div className="animate-spin mr-2 h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
        Loading PDO details...
      </div>
    );
  }

  if (!pdoDetail) {
    return (
      <div className="text-center mt-20">
        <p className="text-gray-500">Data tidak ditemukan.</p>
        <Link to="/pdos" className="text-blue-600 hover:underline">
          Kembali ke List
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link
            to="/pdos"
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <ArrowLeftIcon className="w-6 h-6 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Detail PDO</h1>
            <p className="text-sm text-gray-700">#{pdoDetail.no_pdo}</p>
          </div>
        </div>

        <button
          onClick={handleExportPdf}
          className={`flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 transition-colors bg-white shadow-sm ${
            isExporting ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
          }`}
        >
          {isExporting ? (
            <div className="animate-spin h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full" />
          ) : (
            <PrinterIcon className="w-5 h-5" />
          )}
          <span>{isExporting ? "Downloading..." : "Export PDF"}</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(
                pdoDetail
              )}`}
            >
              {getStatusLabel(pdoDetail)}
            </span>
            <span className="text-xs text-gray-700">
              Tgl Pengajuan: {formatDate(pdoDetail.tgl_pdo)}
            </span>
          </div>
          <div className="text-sm text-gray-700">
            Dibuat: {formatDate(pdoDetail.created_at)}
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <BriefcaseIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-700 mb-1">Proyek</p>
                <p className="font-semibold text-lg text-gray-800">
                  {pdoDetail.project?.job_name || "Unknown Project"}
                </p>
                <p className="text-sm text-gray-700">
                  {pdoDetail.project?.contract_num}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <UserIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-700 mb-1">Pemohon (Site)</p>
                <p className="font-semibold text-gray-800">
                  {pdoDetail.pemohon?.name || "-"}
                </p>
                <p className="text-xs text-gray-700">Project Manager</p>
              </div>
            </div>
          </div>

          <hr className="border-dashed border-gray-200 my-6" />

          <div className="mb-8">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">
              Status Persetujuan
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                className={`p-4 rounded-lg border ${
                  pdoDetail.pemeriksa_id
                    ? "bg-blue-50 border-blue-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <DocumentCheckIcon className="w-5 h-5 text-gray-700" />
                  <span className="font-semibold text-sm">
                    Finance (Pemeriksa)
                  </span>
                </div>

                {renderSignature(pdoDetail.pemeriksa, "Finance")}

                {!pdoDetail.pemeriksa_id &&
                  (hasFullAccess || userRole === "Finance") && (
                    <button
                      onClick={handleApproveFinance}
                      className="w-full text-xs bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors shadow-sm mt-2"
                    >
                      Approve / Check
                    </button>
                  )}
              </div>

              <div
                className={`p-4 rounded-lg border ${
                  pdoDetail.direktur_id
                    ? "bg-green-50 border-green-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <DocumentCheckIcon className="w-5 h-5 text-gray-700" />
                  <span className="font-semibold text-sm">
                    Direktur (Penyetuju)
                  </span>
                </div>

                {renderSignature(pdoDetail.direktur, "Direktur")}

                {pdoDetail.direktur_id && (
                  <p className="text-[10px] text-green-600 mt-1 italic">
                    *Disetujui otomatis
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">
              <span>Rincian Item</span>
              {isFinancePending && (
                <span className="text-xs text-red-500 normal-case font-normal bg-red-50 px-2 py-1 rounded">
                  *Klik tombol silang untuk menolak item spesifik
                </span>
              )}
            </h3>
            <div className="overflow-x-auto border rounded-lg shadow-sm">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">
                      Uraian
                    </th>
                    <th className="px-4 py-3 text-center font-medium text-gray-700">
                      Vol
                    </th>
                    <th className="px-4 py-3 text-center font-medium text-gray-700">
                      Satuan
                    </th>
                    <th className="px-4 py-3 text-right font-medium text-gray-700">
                      Harga Satuan
                    </th>
                    <th className="px-4 py-3 text-right font-medium text-gray-700">
                      Jumlah
                    </th>
                    {isFinancePending && (
                      <th className="px-4 py-3 text-center font-medium text-gray-700 w-16">
                        Aksi
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {pdoDetail.items?.map((item) => {
                    const isRejectedByDB = item.status === "REJECTED";
                    const isRejectedBySession = rejectedItemIds.includes(
                      item.id
                    );
                    const isRejected = isRejectedByDB || isRejectedBySession;
                    return (
                      <tr
                        key={item.id}
                        className={isRejected ? "bg-red-50" : ""}
                      >
                        <td
                          className={`px-4 py-3 ${
                            isRejected ? "line-through text-gray-400" : ""
                          }`}
                        >
                          {item.uraian}
                          {isRejected && (
                            <span className="block text-[10px] text-red-500 font-bold no-underline">
                              (Ditolak)
                            </span>
                          )}
                        </td>
                        <td
                          className={`px-4 py-3 text-center ${
                            isRejected ? "opacity-50" : ""
                          }`}
                        >
                          {item.volume}
                        </td>
                        <td
                          className={`px-4 py-3 text-center ${
                            isRejected ? "opacity-50" : ""
                          }`}
                        >
                          {item.satuan}
                        </td>
                        <td
                          className={`px-4 py-3 text-right ${
                            isRejected ? "line-through opacity-50" : ""
                          }`}
                        >
                          {formatIDR(item.harga_satuan)}
                        </td>
                        <td
                          className={`px-4 py-3 text-right font-medium ${
                            isRejected ? "line-through opacity-50" : ""
                          }`}
                        >
                          {formatIDR(item.jumlah)}
                        </td>
                        {isFinancePending && (
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => toggleRejectItem(item.id)}
                              disabled={isRejectedByDB}
                              className={`p-1 rounded-full transition-colors ${
                                isRejected
                                  ? "text-gray-400 hover:text-gray-600 bg-gray-200"
                                  : "text-red-500 hover:text-red-700 hover:bg-red-100"
                              } ${
                                isRejectedByDB
                                  ? "cursor-not-allowed opacity-50"
                                  : ""
                              }`}
                              title={
                                isRejected
                                  ? "Batalkan penolakan"
                                  : "Tolak item ini"
                              }
                            >
                              {isRejected ? (
                                <ArrowLeftIcon className="w-5 h-5" />
                              ) : (
                                <XCircleIcon className="w-5 h-5" />
                              )}
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <div className="bg-gray-50 rounded-xl p-6 flex items-center justify-between border border-gray-200">
              <div>
                <p className="text-sm text-gray-500">Total Diajukan (Awal)</p>
                <p className="text-xl font-semibold text-gray-600">
                  {formatIDR(originalTotal)}
                </p>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-6 flex flex-col justify-between border border-blue-100 shadow-sm relative overflow-hidden">
              <div className="absolute right-0 top-0 p-4 opacity-10">
                <BanknotesIcon className="w-24 h-24 text-blue-600" />
              </div>
              <div className="relative z-10">
                <p className="text-sm text-blue-700 font-medium mb-1">
                  Total Disetujui
                </p>
                <div className="text-3xl font-bold text-blue-800">
                  {formatIDR(approvedTotal)}
                </div>
                {rejectedItemIds.length > 0 && (
                  <p className="text-xs text-red-500 mt-2 font-medium">
                    *Dikurangi {rejectedItemIds.length} item ditolak
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 bg-blue-50 rounded-xl p-6 flex flex-col sm:flex-row justify-between items-center border border-blue-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4 sm:mb-0">
              <div className="bg-blue-600 p-2 rounded-full text-white">
                <BanknotesIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-700 font-medium">
                  Total Pengajuan
                </p>
                <p className="text-xs text-blue-600">Total biaya operasional</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-blue-800">
              {formatIDR(pdoDetail.total_jumlah)}
            </div>
          </div>

          {evidenList.length > 0 && (
            <div className="mt-8">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                <PaperClipIcon className="w-4 h-4" /> Bukti Bon / Nota
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {evidenList.map((file, idx) => (
                  <div
                    key={idx}
                    className="relative group border rounded-lg overflow-hidden bg-gray-50 aspect-square cursor-pointer hover:shadow-md transition-all"
                    onClick={() => setZoomedFile(file)}
                  >
                    {file.type.startsWith("image/") ? (
                      <>
                        <img
                          src={file.url}
                          alt={`Bon ${idx}`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 transition-opacity">
                          <MagnifyingGlassPlusIcon className="w-8 h-8 text-white drop-shadow-md" />
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center text-gray-600 hover:bg-gray-100">
                        <DocumentTextIcon className="w-10 h-10 text-red-500 mb-2" />
                        <span className="text-xs break-all line-clamp-2 px-1">
                          {file.name}
                        </span>
                        <span className="text-[10px] text-gray-400 mt-1 font-bold">
                          KLIK UNTUK LIHAT
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
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

export default PdoDetailPage;
