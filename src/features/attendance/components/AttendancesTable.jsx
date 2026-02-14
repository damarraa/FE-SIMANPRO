import React, { useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  User,
  MapPin,
  Clock,
  Camera,
  History,
  Briefcase,
  Home,
  StickyNote,
} from "lucide-react";
import Swal from "sweetalert2";
import { getImageUrl } from "../../../utils/image";

const StatusBadge = ({ status, label }) => {
  let colorClass = "bg-gray-100 text-gray-800 border-gray-200";

  const checkStatus = (status || "").toLowerCase();
  const checkLabel = (label || "").toLowerCase();

  if (checkLabel.includes("site") || checkLabel.includes("dinas")) {
    colorClass = "bg-orange-50 text-orange-700 border-orange-200";
  } else if (checkStatus === "on_time" || checkLabel.includes("tepat")) {
    colorClass = "bg-green-50 text-green-700 border-green-200";
  } else if (
    checkStatus === "late" ||
    checkLabel.includes("telat") ||
    checkLabel.includes("terlambat")
  ) {
    colorClass = "bg-red-50 text-red-700 border-red-200";
  } else if (
    ["permit", "leave", "izin", "cuti"].includes(checkStatus) ||
    checkLabel.includes("izin")
  ) {
    colorClass = "bg-blue-50 text-blue-700 border-blue-200";
  }

  return (
    <span
      className={`px-2.5 py-0.5 text-xs rounded-full font-medium border ${colorClass} inline-flex items-center gap-1`}
    >
      {label || status || "-"}
    </span>
  );
};

const UserAvatar = ({ user }) => {
  if (!user) {
    return (
      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200">
        <User size={18} />
      </div>
    );
  }

  const imageUrl = getImageUrl(user.profile_picture);
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={user.name}
        className="h-10 w-10 rounded-full object-cover border border-gray-200 shadow-sm"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
            user.name
          )}&background=random`;
        }}
      />
    );
  }

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  return (
    <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-sm border border-blue-700">
      {initials}
    </div>
  );
};

const LocationLink = ({ location, distance }) => {
  if (!location?.lat) return null;
  return (
    <div className="flex flex-col mt-1">
      <a
        href={`https://www.google.com/maps?q=${location.lat},${location.long}`}
        target="_blank"
        rel="noreferrer"
        className="text-xs text-blue-500 flex items-center gap-1 hover:underline w-fit"
        title="Lihat di Google Maps"
      >
        <MapPin size={10} /> Lokasi
      </a>
      {distance && (
        <span className="text-[10px] text-gray-400 ml-3.5">
          Jarak: {distance}
        </span>
      )}
    </div>
  );
};

const PhotoThumbnail = ({ url, title }) => {
  if (!url) return null;

  const handlePreview = () => {
    Swal.fire({
      imageUrl: url,
      imageAlt: title,
      title: title,
      showConfirmButton: false,
      showCloseButton: true,
      width: "auto",
      padding: "1rem",
      backdrop: `rgba(0,0,0,0.8)`,
      imageCustomClass: "max-h-[80vh] object-contain",
    });
  };

  return (
    <div
      onClick={handlePreview}
      className="ml-2 relative group cursor-pointer"
      title="Klik untuk memperbesar"
    >
      <div className="h-8 w-8 rounded-md overflow-hidden border border-gray-200 shadow-sm group-hover:ring-2 group-hover:ring-blue-400 transition-all">
        <img
          src={url}
          alt="Bukti"
          className="h-full w-full object-cover"
          onError={(e) => {
            e.target.style.display = "none";
            e.target.parentElement.classList.add(
              "flex",
              "items-center",
              "justify-center",
              "bg-gray-100"
            );
            e.target.parentElement.innerHTML =
              '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>';
          }}
        />
      </div>
      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center"></div>
    </div>
  );
};

const AttendancesTable = ({ data, pagination, isLoading, onPageChange }) => {
  if (isLoading)
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center text-gray-400 animate-pulse">
        <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-sm font-medium">Memuat data absensi...</p>
      </div>
    );

  if (!data || data.length === 0)
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-dashed border-gray-300 text-center">
        <div className="bg-gray-50 p-4 rounded-full mb-3">
          <Clock className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-gray-900 font-medium">Belum ada data absensi</h3>
        <p className="text-gray-500 text-sm mt-1">
          Data absensi untuk filter yang dipilih tidak ditemukan.
        </p>
      </div>
    );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      <div className="overflow-x-auto flex-1">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#2196F3]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
                Karyawan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
                Tanggal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
                Check In
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
                Check Out
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
                Durasi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => {
              const user = item.user || {};
              const departmentName = user.department?.name;
              const checkIn = item.check_in || {};
              const checkOut = item.check_out || {};

              return (
                <tr
                  key={item.id || index}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="mr-3">
                        <UserAvatar user={user} />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.name || "Unknown"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {departmentName || "-"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(item.date).toLocaleDateString("id-ID", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 align-top">
                    {checkIn.time ? (
                      <div className="flex flex-col">
                        <div className="flex items-center font-medium text-gray-900">
                          {checkIn.time}
                          <PhotoThumbnail
                            url={checkIn.photo_url}
                            title={`Check In: ${user.name}`}
                          />
                        </div>

                        {item.is_onsite ? (
                          <div className="flex items-center gap-1 mt-1 text-xs text-orange-600 font-medium">
                            <Briefcase size={12} /> On Site
                          </div>
                        ) : item.is_wfh ? (
                          <div className="flex items-center gap-1 mt-1 text-xs text-purple-600 font-medium">
                            <Home size={12} /> WFH
                          </div>
                        ) : null}

                        <LocationLink
                          location={checkIn.location}
                          distance={checkIn.distance}
                        />

                        {item.notes && (
                          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-100 rounded text-[10px] text-gray-600 max-w-[200px] whitespace-normal flex gap-1.5 items-start leading-tight">
                            <StickyNote
                              size={12}
                              className="mt-0.5 flex-shrink-0 text-yellow-600"
                            />
                            <span className="italic">{item.notes}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400 italic text-xs">
                        Belum Absen
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {checkOut.time ? (
                      <div className="flex flex-col">
                        <div className="flex items-center font-bold text-gray-800">
                          {checkOut.time}
                          <PhotoThumbnail
                            url={checkOut.photo_url}
                            title={`Check Out: ${user.name}`}
                          />
                        </div>
                        <LocationLink location={checkOut.location} />
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.working_hours ? (
                      <div className="flex items-center gap-1 text-sm text-blue-700 font-medium bg-blue-50 px-2 py-1 rounded w-fit">
                        <History size={14} />
                        {item.working_hours}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <StatusBadge
                      status={item.status}
                      label={item.status_label}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {!isLoading && pagination && pagination.total > 0 && (
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-500 hidden sm:block">
            Hal {pagination.current_page} dari {pagination.last_page} (Total:{" "}
            {pagination.total})
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(pagination.current_page - 1)}
              disabled={pagination.current_page <= 1}
              className="p-2 border rounded hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => onPageChange(pagination.current_page + 1)}
              disabled={pagination.current_page === pagination.last_page}
              className="p-2 border rounded hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendancesTable;
