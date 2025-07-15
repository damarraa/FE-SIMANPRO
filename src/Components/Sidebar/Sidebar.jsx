import {
  Home,
  Briefcase,
  Box,
  Truck,
  DollarSign,
  User,
  ShieldCheck,
  MessageSquare,
  Activity,
  Settings,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

const menuItems = [
  { label: "Dashboard", icon: <Home size={20} />, path: "/" },
  { label: "Manajemen Proyek", icon: <Briefcase size={20} />, path: "/proyek" },
  { label: "Gudang", icon: <Box size={20} />, path: "/gudang" },
  { label: "Alat Berat & Kendaraan", icon: <Truck size={20} />, path: "/kendaraan" },
  { label: "Accounting & Finance", icon: <DollarSign size={20} />, path: "/akuntansi" },
  { label: "Tenaga Kerja", icon: <User size={20} />, path: "/tenaga-kerja" },
  { label: "QC & K3", icon: <ShieldCheck size={20} />, path: "/qc&k3" },
  { label: "Laporan & Dokumentasi", icon: <Activity size={20} />, path: "/laporan" },
  { label: "Pengaturan", icon: <Settings size={20} />, path: "/pengaturan" },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-[#2196F3] text-white h-screen flex flex-col">
      {/* Logo */}
      <div className="flex items-center px-6 py-5 space-x-3 border-b border-white/20">
        <div className="bg-red-500 text-xl text-white font-bold rounded-full w-10 h-10 flex items-center justify-center">
          P
        </div>
        <h1 className="text-xl font-bold">PRISAN</h1>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-2 py-6 space-y-2 relative">
        {menuItems.map((item, idx) => {
          const isActive = location.pathname === item.path || 
                         (item.path !== "/" && location.pathname.startsWith(item.path));
          
          return (
            <NavLink
              key={idx}
              to={item.path}
              className={`relative z-10 flex items-center gap-3 px-5 py-2 cursor-pointer transition-all duration-300 ${
                isActive ? "text-[#2196F3]" : "text-white hover:bg-white/20"
              }`}
            >
              {/* Background oval untuk active */}
              {isActive && (
                <div className="absolute inset-0 right-0 z-0 bg-white rounded-l-full"></div>
              )}
              <span className="z-10">{item.icon}</span>
              <span className="z-10">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}