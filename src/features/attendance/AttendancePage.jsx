import React, { useState, useEffect } from "react";
import {
  MapPin,
  Clock,
  Camera,
  Home,
  Building,
  Calendar,
  Briefcase,
} from "lucide-react";
import useAttendance from "./hooks/useAttendance";
import WebcamCapture from "./components/WebcamCapture";
import Swal from "sweetalert2";

const dataURLtoFile = (dataurl, filename) => {
  if (!dataurl) return null;
  let arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new File([u8arr], filename, { type: mime });
};

const AttendancePage = () => {
  const {
    history,
    todayPresence,
    isLoading,
    performCheckIn,
    performCheckOut,
    refresh,
  } = useAttendance();
  const [showCamera, setShowCamera] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [attendanceType, setAttendanceType] = useState("wfo");
  const [notes, setNotes] = useState("");
  // const [isWFH, setIsWFH] = useState(false);

  const hasCheckedIn = !!todayPresence;
  const hasCheckedOut =
    todayPresence?.check_out !== null && todayPresence?.check_out !== undefined;

  const handleAttendanceClick = (type) => {
    if (
      type === "in" &&
      attendanceType === "onsite" &&
      (!notes || notes.trim().length < 3)
    ) {
      Swal.fire(
        "Peringatan",
        "Harap isi Keterangan / Lokasi Proyek untuk Absensi On Site.",
        "warning"
      );
      return;
    }

    setActionType(type);
    setShowCamera(true);
  };

  const onPhotoCaptured = async (base64Image) => {
    setShowCamera(false);
    setIsProcessing(true);

    if (!navigator.geolocation) {
      Swal.fire("Error", "Browser anda tidak support Geolocation", "error");
      setIsProcessing(false);
      return;
    }

    // console.log("[Geo] Meminta lokasi...");

    const geoOptions = {
      enableHighAccuracy: false,
      timeout: 30000,
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        // console.log("[Geo] Lokasi ditemukan:", position.coords);

        const { latitude, longitude } = position.coords;
        const file = dataURLtoFile(base64Image, "attendance_photo.jpg");

        const formData = new FormData();
        formData.append("latitude", latitude);
        formData.append("longitude", longitude);
        formData.append("photo", file);
        if (attendanceType === "wfh") {
          formData.append("is_wfh", 1);
        } else if (attendanceType === "onsite") {
          formData.append("is_onsite", 1);
          formData.append("notes", notes);
        }

        // formData.append("is_wfh", isWFH ? 1 : 0);

        let success;
        if (actionType === "in") {
          success = await performCheckIn(formData);
        } else {
          success = await performCheckOut(formData);
        }
        setIsProcessing(false);
        if (success) refresh();
      },
      (error) => {
        console.error("[Geo Error Detail]", error);
        setIsProcessing(false);

        let msg = "Gagal mengambil lokasi.";
        if (error.code === 1) {
          msg = "Izin lokasi ditolak. Harap izinkan akses lokasi di browser.";
        } else if (error.code === 2) {
          msg = "Posisi tidak tersedia (Pastikan GPS/Wi-Fi aktif).";
        } else if (error.code === 3) {
          msg = "Waktu permintaan lokasi habis (Timeout). Coba lagi.";
        }

        if (
          window.location.protocol !== "https:" &&
          window.location.hostname !== "localhost"
        ) {
          msg +=
            " (PENTING: Lokasi mungkin diblokir karena tidak menggunakan HTTPS).";
        }

        Swal.fire("Gagal", msg, "error");
      },
      geoOptions
    );
  };

  return (
    <div className="w-full space-y-8 p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-[#0D47A1] flex items-center gap-2">
        <Clock className="w-6 h-6" /> Absensi Harian
      </h1>

      <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center justify-center gap-6 border border-gray-100">
        <div className="text-center">
          <p className="text-gray-500 mb-1 flex items-center justify-center gap-2">
            <Calendar size={16} />
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <h2 className="text-xl font-bold text-[#0D47A1]">
            {isLoading
              ? "Memuat..."
              : hasCheckedIn
              ? hasCheckedOut
                ? "Sudah Pulang"
                : "Sedang Bekerja"
              : "Belum Check In"}
          </h2>
        </div>

        {!hasCheckedIn && !isLoading && (
          <div className="w-full flex flex-col gap-4 items-center">
            <div className="flex flex-wrap justify-center gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-200 w-full sm:w-auto">
              <button
                onClick={() => setAttendanceType("wfo")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  attendanceType === "wfo"
                    ? "bg-white text-blue-600 shadow-sm border border-gray-100 ring-1 ring-black/5"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Building size={16} /> WFO
              </button>
              <button
                onClick={() => setAttendanceType("wfh")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  attendanceType === "wfh"
                    ? "bg-blue-50 text-blue-700 shadow-inner ring-1 ring-blue-200"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Home size={16} /> WFH
              </button>
              <button
                onClick={() => setAttendanceType("onsite")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  attendanceType === "onsite"
                    ? "bg-orange-50 text-orange-700 shadow-inner ring-1 ring-orange-200"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Briefcase size={16} /> On Site
              </button>
            </div>

            {attendanceType === "onsite" && (
              <div className="w-full max-w-md animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                  Keterangan / Lokasi Proyek{" "}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: Kunjungan ke Site Project Rumbai..."
                  className="w-full px-4 py-3 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-orange-50/30 text-sm resize-none"
                  rows={3}
                ></textarea>
                <p className="text-xs text-gray-500 mt-1 ml-1">
                  *Wajib diisi untuk memvalidasi lokasi dinas luar.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-4 w-full">
          <button
            onClick={() => handleAttendanceClick("in")}
            disabled={hasCheckedIn || isProcessing}
            className={`flex-1 py-4 rounded-xl flex flex-col items-center justify-center gap-2 font-bold transition-all shadow-md
              ${
                hasCheckedIn || isProcessing
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200 shadow-none"
                  : attendanceType === "wfh"
                  ? "bg-purple-600 text-white hover:bg-purple-700 hover:shadow-lg"
                  : attendanceType === "onsite"
                  ? "bg-orange-600 text-white hover:bg-orange-700 hover:shadow-lg"
                  : "bg-green-600 text-white hover:bg-green-700 hover:shadow-lg"
              }
            `}
          >
            <Camera className="w-6 h-6" />
            CHECK IN
            {attendanceType === "wfh" && !hasCheckedIn ? " (WFH)" : ""}
            {attendanceType === "onsite" && !hasCheckedIn ? " (SITE)" : ""}
          </button>

          <button
            onClick={() => handleAttendanceClick("out")}
            disabled={!hasCheckedIn || hasCheckedOut || isProcessing}
            className={`flex-1 py-4 rounded-xl flex flex-col items-center justify-center gap-2 font-bold transition-all shadow-md
              ${
                !hasCheckedIn || hasCheckedOut || isProcessing
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200 shadow-none"
                  : "bg-red-600 text-white hover:bg-red-700 hover:shadow-lg"
              }
            `}
          >
            <MapPin className="w-6 h-6" />
            CHECK OUT
          </button>
        </div>

        {isProcessing && (
          <p className="text-sm text-blue-600 animate-pulse">
            Memproses data & lokasi...
          </p>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="p-5 border-b border-gray-100 bg-gray-50/30">
          <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">
            Riwayat Absensi
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-[#2196F3] text-white font-medium">
              <tr>
                <th className="px-6 py-3 whitespace-nowrap">Tanggal</th>
                <th className="px-6 py-3 whitespace-nowrap">Tipe</th>
                <th className="px-6 py-3 whitespace-nowrap">Masuk</th>
                <th className="px-6 py-3 whitespace-nowrap">Pulang</th>
                <th className="px-6 py-3 whitespace-nowrap">Durasi</th>
                <th className="px-6 py-3 whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="text-center py-8">
                    Loading...
                  </td>
                </tr>
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-400">
                    Belum ada data absensi.
                  </td>
                </tr>
              ) : (
                history.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-blue-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {new Date(item.date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${
                          item.is_wfh
                            ? "bg-purple-50 text-purple-600 border-purple-200"
                            : "bg-blue-50 text-blue-600 border-blue-200"
                        }`}
                      >
                        {item.is_wfh ? "WFH" : "WFO"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-700">
                          {item.check_in?.time || "-"}
                        </span>
                        {item.check_in?.distance && (
                          <span className="text-[10px] text-gray-400">
                            {item.check_in.distance}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-700">
                        {item.check_out?.time || "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {item.working_hours || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          item.status_label === "Terlambat"
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {item.status_label}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showCamera && (
        <WebcamCapture
          onCapture={onPhotoCaptured}
          onClose={() => setShowCamera(false)}
        />
      )}
    </div>
  );
};

export default AttendancePage;
