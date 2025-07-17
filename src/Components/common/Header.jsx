import React from "react";
import { useAuthStore } from "../../store/authStore";
import LogoutButton from "./LogoutButton";

const Header = () => {
  const { user } = useAuthStore();

  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center ml-64">
      <div className="">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
      </div>
      <div className="flex items-center space-x-4">
        {/* ... (komponen search bar Anda) ... */}
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-700 font-medium">
              {user?.name?.slice(0, 2).toUpperCase()}
            </span>
          </div>
          <div className="">
            <div className="font-medium">{user?.name}</div>
            <div className="text-xs text-gray-500">{user?.roles?.[0]}</div>
          </div>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
};

export default Header;