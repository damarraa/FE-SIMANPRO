import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, ChevronDown, User, Settings, LogOut, Menu } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import api from "../../api";
import LogoutButton from "../common/LogoutButton";
import { getImageUrl } from "../../utils/image";
import NotificationDropdown from "../common/NotificationDropdown";

const Header = ({ onMenuClick }) => {
  const { user } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // console.log("HEADER USER DATA:", user);

  const navigate = useNavigate();
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoadingNotif, setIsLoadingNotif] = useState(false);
  const notifRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const response = await api.get("/notifications");
      const data = response.data.data || response.data;

      setNotifications(data);
      const unread = data.filter((n) => !n.read_at).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Gagal load notifikasi:", error);
    } finally {
      setIsLoadingNotif(false);
    }
  };

  useEffect(() => {
    setIsLoadingNotif(true);
    fetchNotifications();

    const intervalId = setInterval(() => {
      fetchNotifications();
    }, 30000);

    return () => clearInterval(intervalId);
  }, []);

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.read_at) {
        await api.post(`/notifications/${notification.id}/read`);

        const updatedNotifs = notifications.map((n) =>
          n.id === notification.id
            ? { ...n, read_at: new Date().toISOString() }
            : n
        );
        setNotifications(updatedNotifs);
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }

      setIsNotifOpen(false);
      if (notification.data.action_url) {
        navigate(notification.data.action_url);
      }
    } catch (error) {
      console.error("Error clicking notification:", error);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const names = name.split(" ");
    if (names.length > 1) {
      return names[0][0] + names[names.length - 1][0];
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const toggleNotif = () => setIsNotifOpen(!isNotifOpen);

  const handleProfileClick = () => {
    navigate("/profile");
    setIsDropdownOpen(false);
  };

  return (
    <div className="bg-white p-4 pr-6 flex justify-between items-center border-b border-gray-200 shadow-sm">
      {/* Left: Menu button (mobile only) */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
      >
        <Menu size={22} />
      </button>

      {/* Right: Notifications & Profile */}
      <div className="flex items-center gap-4 ml-auto">
        {/* Notification Icon with Badge */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={toggleNotif}
            className={`relative text-gray-600 hover:text-blue-600 p-2 rounded-full hover:bg-gray-100 transition-colors ${
              isNotifOpen ? "bg-gray-100 text-blue-600" : ""
            }`}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white animate-pulse">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <NotificationDropdown
              notifications={notifications}
              isLoading={isLoadingNotif}
              onItemClick={handleNotificationClick}
            />
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-gray-200"></div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {user?.profile_picture ? (
              <img
                // src={user.profile_picture}
                src={getImageUrl(user.profile_picture)}
                // src={getImageUrl(user.profile_picture_url)}
                alt="profile"
                className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                {getInitials(user?.name)}
              </div>
            )}

            {/* User Info */}
            <div className="text-left hidden md:block">
              <p className="text-sm font-semibold text-gray-800 leading-tight">
                {user?.name || "Nama User"}
              </p>
              <p className="text-xs text-gray-500 leading-tight">
                {user?.roles?.[0] || "Role"}
                {/* {user?.roles?.[0]?.name || "Role"} */}
              </p>
            </div>

            {/* Dropdown Chevron */}
            <ChevronDown
              className={`w-4 h-4 text-gray-500 transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-800">
                  {user?.name || "Nama User"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Role:{" "}
                  <span className="font-bold">
                    {" "}
                    {user?.roles?.[0] || "Role"}{" "}
                  </span>
                  {/* {user?.roles?.[0]?.name || "Role"} */}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {user?.email || "user@example.com"}
                </p>
              </div>

              <button
                onClick={handleProfileClick}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <User className="w-4 h-4" />
                Profil Saya
              </button>

              {/* <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <Settings className="w-4 h-4" />
                Pengaturan
              </button> */}

              <div className="border-t border-gray-100 mt-2 pt-2">
                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <LogoutButton>
                    <div className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                      <LogOut className="w-4 h-4" />
                      Keluar
                    </div>
                  </LogoutButton>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
