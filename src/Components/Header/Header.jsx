import React from "react";
import { Bell, Sun } from "lucide-react";

const Header = () => {
  return (
    <div className="flex justify-end items-center ">
      <div className="flex items-center gap-4">
        {/* Notification Icon */}
        <button className="text-gray-600 hover:text-blue-600">
          <Bell className="w-6 h-6" />
        </button>

        {/* User Info */}
        <div className="text-right">
          <p className="text-sm font-semibold text-[#0D47A1] leading-tight">Nanda</p>
          <p className="text-xs text-gray-500 leading-tight">Admin Proyek</p>
        </div>

        {/* Profile Photo */}
        <img
          src="https://i.pravatar.cc/40?img=3"
          alt="profile"
          className="w-10 h-10 rounded-full border-2 border-blue-500 object-cover"
        />
      </div>
    </div>
  );
};

export default Header;
