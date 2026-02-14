import React, { useState, useRef, useEffect } from "react";
import { Bell, ChevronDown, User, Settings, LogOut } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import LogoutButton from "../common/LogoutButton";

const Header = () => {
  const { user } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  return (
    <div className="bg-white p-4 pr-6 flex justify-between items-center border-b border-gray-200 shadow-sm">
      {/* Page Title - bisa disesuaikan dengan current page */}
      <div className="text-xl font-semibold text-gray-800"></div>

      <div className="flex items-center gap-4">
        {/* Notification Icon with Badge */}
        <button className="relative text-gray-600 hover:text-blue-600 p-2 rounded-full hover:bg-gray-100 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            3
          </span>
        </button>

        {/* Garis pemisah */}
        <div className="w-px h-8 bg-gray-200"></div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {/* Foto Profil */}
            <div className="flex items-center gap-3">
              {user?.profile_picture_url ? (
                <img
                  src={user.profile_picture_url}
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
                </p>
              </div>

              {/* Dropdown Chevron */}
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </div>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              {/* User Info in Dropdown */}
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-800">
                  {user?.name || "Nama User"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {user?.roles?.[0] || "Role"}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {user?.email || "user@example.com"}
                </p>
              </div>

              {/* Dropdown Items */}
              <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <User className="w-4 h-4" />
                Profil Saya
              </button>

              <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <Settings className="w-4 h-4" />
                Pengaturan
              </button>

              <div className="border-t border-gray-100 mt-2 pt-2">
                <LogoutButton>
                  <div className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                    <LogOut className="w-4 h-4" />
                    Keluar
                  </div>
                </LogoutButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
