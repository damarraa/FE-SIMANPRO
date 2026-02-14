import React, { useEffect, useState } from "react";
import {
  Activity,
  Archive,
  ArrowRightLeft,
  Box,
  Briefcase,
  Building2,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  ClipboardList,
  ClipboardPen,
  ClipboardPlus,
  DollarSign,
  Home,
  HeartHandshake,
  ShoppingBag,
  Truck,
  User,
  ShieldCheck,
  Settings,
  Wrench,
  Users,
  FileText,
  Menu,
  X,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { usePermission } from "../../hooks/usePermission";

const menuStructure = [
  {
    group: "Dashboard",
    items: [
      {
        label: "Dashboard Utama",
        icon: <Home size={18} />,
        path: "dashboard",
        allowedRoles: [
          "Super Admin",
          "Admin",
          "Project Manager",
          "Logistic",
          "Purchasing",
        ],
      },
    ],
  },
  {
    group: "Manajemen Proyek",
    items: [
      {
        label: "Proyek",
        icon: <Briefcase size={18} />,
        path: "projects",
        allowedRoles: ["Super Admin", "Admin", "Project Manager", "Supervisor"],
      },
      {
        label: "Klien",
        icon: <HeartHandshake size={18} />,
        path: "clients",
        allowedRoles: ["Super Admin", "Admin", "Project Manager"],
      },
    ],
  },
  {
    group: "Procurement",
    items: [
      {
        label: "Purchase Order",
        icon: <ShoppingBag size={18} />,
        path: "purchase-orders",
        allowedRoles: [
          // "Super Admin",
          // "Admin",
          "Purchasing",
        ],
      },
      {
        label: "Supplier",
        icon: <Building2 size={18} />,
        path: "suppliers",
        allowedRoles: ["Super Admin", "Admin", "Purchasing", "Logistic"],
      },
    ],
  },
  {
    group: "Logistik",
    items: [
      {
        label: "Permintaan Material",
        icon: <ClipboardList size={18} />,
        path: "material-requisitions",
        allowedRoles: [
          "Super Admin",
          "Admin",
          "Project Manager",
          "Logistic",
          // "Supervisor",
        ],
      },
      {
        label: "Permintaan Alat",
        icon: <ClipboardPen size={18} />,
        path: "tool-requisitions",
        allowedRoles: [
          "Super Admin",
          "Admin",
          "Project Manager",
          "Logistic",
          // "Supervisor",
        ],
      },
      {
        label: "Permintaan Kendaraan",
        icon: <ClipboardPlus size={18} />,
        path: "vehicle-requisitions",
        allowedRoles: [
          "Super Admin",
          "Admin",
          "Project Manager",
          "Logistic",
          // "Supervisor",
        ],
      },
      {
        label: "Gudang",
        icon: <Box size={18} />,
        path: "warehouses",
        allowedRoles: ["Super Admin", "Admin", "Logistic"],
      },
      {
        label: "Material",
        icon: <Archive size={18} />,
        path: "materials",
        allowedRoles: ["Super Admin", "Admin", "Logistic", "Purchasing"],
      },
      // {
      //   label: "Pergerakan Stok",
      //   icon: <ArrowRightLeft size={18} />,
      //   path: "stock-movements",
      //   allowedRoles: ["Super Admin", "Admin", "Logistic"],
      // },
    ],
  },
  {
    group: "Aset & Kendaraan",
    items: [
      {
        label: "Alat",
        icon: <Wrench size={18} />,
        path: "tools",
        allowedRoles: ["Super Admin", "Admin", "Logistic"],
      },
      {
        label: "Kendaraan",
        icon: <Truck size={18} />,
        path: "vehicles",
        allowedRoles: ["Super Admin", "Admin", "Logistic"],
      },
      {
        label: "Penugasan Kendaraan",
        icon: <Truck size={18} />,
        path: "vehicle-assignments",
        allowedRoles: ["Super Admin", "Admin", "Logistic"],
      },
    ],
  },
  {
    group: "Pengaturan",
    items: [
      {
        label: "Pengguna",
        icon: <Users size={18} />,
        path: "employees",
        allowedRoles: ["Super Admin"],
      },
      {
        label: "Pengaturan Sistem",
        icon: <Users size={18} />,
        path: "roles",
        allowedRoles: ["Super Admin"],
      },
    ],
  },
  // -----
  // Disable sementara
  // -----
  // {
  //   group: "Laporan & Analytics",
  //   items: [
  //     {
  //       label: "Laporan Proyek",
  //       icon: <FileText size={18} />,
  //       path: "project-reports",
  //       allowedRoles: ["Super Admin", "Admin", "Project Manager", "Supervisor"],
  //     },
  //     {
  //       label: "Laporan Inventory",
  //       icon: <Activity size={18} />,
  //       path: "inventory-reports",
  //       allowedRoles: ["Super Admin", "Admin", "Logistic"],
  //     },
  //   ],
  // },
];

export default function Sidebar({ isMobileOpen, setIsMobileOpen }) {
  const location = useLocation();
  const { user } = useAuthStore();
  const { can } = usePermission();
  const [expandedGroups, setExpandedGroups] = useState({});

  const getUserRoleNames = () => {
    if (!user) return [];
    if (Array.isArray(user.roles) && user.roles.length > 0) {
      if (typeof user.roles[0] === "object" && user.roles[0]?.name) {
        return user.roles.map((r) => r.name);
      }

      if (typeof user.roles[0] === "string") {
        return user.roles;
      }
    }

    if (typeof user.role === "string") {
      return [user.role];
    }

    return [];
  };

  const hasAccess = (allowedRoles) => {
    const userRoles = getUserRoleNames();
    if (!allowedRoles || allowedRoles.length === 0) return true;
    return userRoles.some((role) => allowedRoles.includes(role));
  };

  const getAccessibleMenu = () => {
    return menuStructure
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => hasAccess(item.allowedRoles)),
      }))
      .filter((group) => group.items.length > 0);
  };

  const toggleGroup = (groupName) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  const accessibleMenu = getAccessibleMenu();
  const userRoles = getUserRoleNames();

  return (
    <>
      {/* Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-[#0D47A1] text-white shadow-xl flex flex-col transform transition-transform duration-300 z-50
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 relative">
          <div className="flex items-center space-x-3">
            <div className="bg-white text-blue-800 text-xl font-bold rounded-full w-10 h-10 flex items-center justify-center shadow-lg">
              PAL
            </div>
            <div>
              <h1 className="text-xl font-bold">SIMANPRO</h1>
              <p className="text-xs text-blue-200">PT PRISAN ARTHA LESTARI</p>
            </div>
          </div>
          <button
            className="lg:hidden absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-md hover:bg-blue-700/40"
            onClick={() => setIsMobileOpen(false)}
          >
            <X size={22} />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {accessibleMenu.map((group, groupIndex) => {
            const isGroupExpanded = expandedGroups[group.group] !== false;
            const hasActiveItem = group.items.some(
              (item) =>
                location.pathname === `/${item.path}` ||
                location.pathname.startsWith(`/${item.path}/`)
            );

            return (
              <div key={groupIndex} className="mb-2">
                <button
                  onClick={() => toggleGroup(group.group)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                    hasActiveItem ? "bg-blue-700/50" : "hover:bg-blue-700/30"
                  }`}
                >
                  <span className="text-sm font-semibold text-blue-200 uppercase tracking-wide">
                    {group.group}
                  </span>
                  {isGroupExpanded ? (
                    <ChevronDown size={16} className="text-blue-300" />
                  ) : (
                    <ChevronRight size={16} className="text-blue-300" />
                  )}
                </button>

                {isGroupExpanded && (
                  <div className="mt-1 space-y-1">
                    {group.items.map((item, itemIndex) => {
                      const isActive =
                        location.pathname === `/${item.path}` ||
                        location.pathname.startsWith(`/${item.path}/`);
                      return (
                        <NavLink
                          key={itemIndex}
                          to={item.path}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                            isActive
                              ? "bg-white text-blue-800 shadow-md"
                              : "text-blue-100 hover:bg-blue-700/50 hover:text-white"
                          }`}
                        >
                          <span
                            className={`${
                              isActive ? "text-blue-600" : "text-blue-300"
                            }`}
                          >
                            {item.icon}
                          </span>
                          <span className="font-medium">{item.label}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
