import React from "react";
import { Bell } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import LogoutButton from "../common/LogoutButton";

const Header = () => {
  const { user } = useAuthStore();
  const getInitials = (name) => {
    if (!name) return "U";
    const names = name.split(" ");
    if (names.length > 1) {
      return names[0][0] + names[names.length - 1][0];
    }
    return name.slice(0, 2);
  };

  return (
    <div className="bg-white p-4 pr-6 flex justify-end items-center border-b border-gray-200">
      <div className="flex items-center gap-4">
        {/* Notification Icon */}
        <button className="text-gray-600 hover:text-blue-600">
          <Bell className="w-6 h-6" />
        </button>

        {/* Garis pemisah */}
        <div className="w-px h-8 bg-gray-200"></div>

        <div className="flex items-center gap-3">
          {/* Foto Profil */}
          {user?.profile_picture_url ? (
            <img
              src="{user.profile_picture_url}"
              alt="profile"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
              {getInitials(user?.name)}
            </div>
          )}

          {/* Nama dan Role */}
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-800 leading-tight">
              {user?.name || "Nama User"}
            </p>
            <p className="text-xs text-gray-500 leading-tight">
              {user?.roles?.[0] || "Role"}
            </p>

            {/* Logout */}
            <LogoutButton />
          </div>
        </div>

        {/* User Info */}
        {/* <div className="text-right">
          <p className="text-sm font-semibold text-[#0D47A1] leading-tight">
            Nanda
          </p>
          <p className="text-xs text-gray-500 leading-tight">Admin Proyek</p>
        </div> */}

        {/* Profile Photo */}
        {/* <img
          src="https://i.pravatar.cc/40?img=3"
          alt="profile"
          className="w-10 h-10 rounded-full border-2 border-blue-500 object-cover"
        /> */}
      </div>
    </div>
  );
};

export default Header;
