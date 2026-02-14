import React, { useState, useEffect } from "react";
import api from "../../api";
import {
  Users,
  HardHat,
  Wrench,
  Truck,
  ArrowUp,
  Calendar,
  AlertTriangle,
  FileText,
  Settings,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const projectData = [
  { name: "Jan", active: 4, completed: 2 },
  { name: "Feb", active: 3, completed: 1 },
  { name: "Mar", active: 5, completed: 3 },
  { name: "Apr", active: 7, completed: 2 },
  { name: "May", active: 6, completed: 4 },
  { name: "Jun", active: 8, completed: 3 },
];

const projectStatusData = [
  { name: "On Progress", value: 60 },
  { name: "Maintenance", value: 20 },
  { name: "Completed", value: 20 },
];

const COLORS = ["#2196F3", "#FF9800", "#00C49F"];

const DashboardPage = () => {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Data dari API Laravel
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await api.get("/v2/dashboard");
        
        // Debugging: Cek isi response di console browser
        // console.log("Dashboard Data:", response.data); 
        
        setStatsData(response.data.data);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        setError("Gagal memuat data dashboard. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const statsConfig = statsData ? [
    {
      title: "Total Users",
      value: statsData.users.total,
      subInfo: `${statsData.users.active} Active Users`,
      icon: <Users className="w-6 h-6" />,
      color: "text-blue-500",
      trend: "up" 
    },
    {
      title: "Active Projects",
      value: statsData.projects.ongoing, 
      subInfo: `Total: ${statsData.projects.total} Records`,
      icon: <HardHat className="w-6 h-6" />,
      color: "text-orange-500",
      trend: "up"
    },
    {
      title: "Tools Condition",
      value: `${statsData.tools.good_condition}`,
      subInfo: `from ${statsData.tools.total} Tools`,
      icon: <Wrench className="w-6 h-6" />,
      color: "text-purple-500",
      trend: "up"
    },
    {
      title: "Vehicles",
      value: statsData.vehicles.total,
      subInfo: `${statsData.vehicles.needs_attention} Need Attention`,
      icon: <Truck className="w-6 h-6" />,
      color: statsData.vehicles.needs_attention > 0 ? "text-red-500" : "text-green-500",
      trend: statsData.vehicles.needs_attention > 0 ? "down" : "up"
    },
  ] : [];

  // Loading State
  if (loading) {
    return (
        <div className="p-6 flex items-center justify-center h-screen bg-gray-50">
            <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-500 text-sm">Memuat data Dashboard...</p>
            </div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="p-6 flex items-center justify-center h-screen bg-gray-50">
            <div className="text-center">
                <p className="text-red-500 mb-2 font-semibold">Terjadi Kesalahan</p>
                <p className="text-gray-600 mb-4">{error}</p>
                <button 
                    onClick={() => window.location.reload()} 
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                    Reload Halaman
                </button>
            </div>
        </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Dashboard Overview</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsConfig.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  {stat.title}
                </p>
                <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                
                <div className={`flex items-center mt-2 text-xs font-medium ${
                    stat.trend === 'down' ? 'text-red-500' : 'text-green-600'
                }`}>
                  {stat.trend === "up" ? (
                    <ArrowUp className="w-3 h-3 mr-1" />
                  ) : (
                    <AlertTriangle className="w-3 h-3 mr-1" />
                  )}
                  {stat.subInfo}
                </div>
              </div>
              
              <div className={`p-3 rounded-lg bg-opacity-10 ${stat.color.replace('text-', 'bg-')} ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Project Activity Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg text-gray-800">Aktivitas Proyek</h3>
            <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50">
              <option>6 Bulan Terakhir</option>
              <option>Tahun Ini</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} dy={10} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#F3F4F6' }} />
                <Legend iconType="circle" />
                <Bar dataKey="active" fill="#2196F3" name="Proyek Aktif" radius={[4, 4, 0, 0]} barSize={30} />
                <Bar dataKey="completed" fill="#00C49F" name="Proyek Selesai" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Project Status Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg text-gray-800">Status Proyek</h3>
            <div className="flex items-center text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
              <Calendar className="w-4 h-4 mr-2" />
              <span>Hari Ini</span>
            </div>
          </div>
          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={projectStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Actions (Placeholder) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-lg mb-4">Aktivitas Terkini</h3>
             <p className="text-gray-400 text-sm italic">Menunggu integrasi Activity Log...</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
          <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {[
                { label: 'Tambah User Baru', icon: <Users size={18}/> },
                { label: 'Buat Proyek Baru', icon: <HardHat size={18}/> },
                { label: 'Generate Laporan', icon: <FileText size={18}/> },
                { label: 'Pengaturan Sistem', icon: <Settings size={18}/> },
            ].map((action, idx) => (
                <button key={idx} className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 rounded-lg border border-gray-200 transition-colors">
                    <span className="mr-3 text-blue-500">{action.icon}</span>
                    {action.label}
                </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;