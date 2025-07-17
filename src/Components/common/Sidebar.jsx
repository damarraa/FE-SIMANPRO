import React from "react";
import { NavLink } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { DASHBOARD_SIDEBAR_LINKS } from "../../lib/constants/navigation";

const SidebarLink = ({ item }) => {
  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
          isActive
            ? "bg-[#2196F3] text-white"
            : "text-gray-700 hover:bg-gray-100"
        }`
      }
    >
      <span className="w-5 h-5 mr-3">{item.icon}</span>
      {item.label}
    </NavLink>
  );
};

const Sidebar = () => {
  const { user } = useAuthStore();
  const userRoles = user?.roles || [];

  // Filter link berdasarkan role
  const accessibleLinks = DASHBOARD_SIDEBAR_LINKS.filter((link) =>
    link.allowedRoles.some((allowedRole) => userRoles.includes(allowedRole))
  );

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-md">
      <div className="flex items-center justify-center h-16 px-4 bg-[#0D47A1] text-white">
        <h1 className="text-xl font-bold">SIMANPRO</h1>
      </div>

      <nav className="p-4">
        <div className="space-y-1">
          {accessibleLinks.map((item) => (
            <SidebarLink key={item.key} item={item} />
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;