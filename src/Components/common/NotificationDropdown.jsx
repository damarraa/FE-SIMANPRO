import React from "react";
import { Package, Truck, Wrench, Info, CheckCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

const NotificationDropdown = ({ notifications, onItemClick, isLoading }) => {
  if (isLoading) {
    return (
      <div className="p-4 text-center text-gray-500 text-sm">
        Memuat notifikasi...
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="p-8 text-center text-gray-400 flex flex-col items-center">
        <CheckCircle className="w-8 h-8 mb-2 opacity-50" />
        <p className="text-sm">Tidak ada notifikasi baru</p>
      </div>
    );
  }

  const getIcon = (type) => {
    switch (type) {
      case "request_material":
        return <Package className="w-5 h-5 text-blue-500" />;
      case "request_tool":
        return <Wrench className="w-5 h-5 text-orange-500" />;
      case "request_vehicle":
        return <Truck className="w-5 h-5 text-green-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <h3 className="font-semibold text-gray-700 text-sm">Notifikasi</h3>
        <span className="text-xs text-gray-500">Terbaru</span>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {notifications.map((notification) => (
          <button
            key={notification.id}
            onClick={() => onItemClick(notification)}
            className={`w-full text-left px-4 py-3 flex gap-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-none ${
              !notification.read_at ? "bg-blue-50/50" : ""
            }`}
          >
            <div className="mt-1 flex-shrink-0">
              {getIcon(notification.data.type)}
            </div>

            <div className="flex-1">
              <p
                className={`text-sm ${
                  !notification.read_at
                    ? "font-semibold text-gray-800"
                    : "text-gray-600"
                }`}
              >
                {notification.data.title}
              </p>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                {notification.data.message}
              </p>
              <p className="text-[10px] text-gray-400 mt-2">
                {formatDistanceToNow(new Date(notification.created_at), {
                  addSuffix: true,
                  locale: id,
                })}
              </p>
            </div>

            {!notification.read_at && (
              <div className="flex-shrink-0 self-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NotificationDropdown;
