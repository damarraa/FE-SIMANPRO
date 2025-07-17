import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { LogOut } from "lucide-react";

const LogoutButton = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await logout();
    navigate("/auth/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 text-red-500 hover:text-red-700"
    >
      <LogOut size={18} />
      <span>Logout</span>
    </button>
  );
};

export default LogoutButton;
