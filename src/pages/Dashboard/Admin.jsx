import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { 
  LayoutDashboard, Users, HardHat, ClipboardList, FileText, Settings,
  ArrowUp, ArrowDown, DollarSign, Calendar, AlertTriangle 
} from 'lucide-react';

const AdminDashboard = () => {
  // Data contoh
  const projectData = [
    { name: 'Jan', active: 12, completed: 4 },
    { name: 'Feb', active: 18, completed: 6 },
    { name: 'Mar', active: 15, completed: 8 },
    { name: 'Apr', active: 22, completed: 5 },
    { name: 'Mei', active: 19, completed: 9 },
    { name: 'Jun', active: 25, completed: 7 },
  ];

  const projectStatusData = [
    { name: 'Berjalan', value: 15 },
    { name: 'Selesai', value: 8 },
    { name: 'Tertunda', value: 3 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  const recentActivities = [
    { id: 1, user: 'John Doe', action: 'Membuat laporan harian', project: 'Gedung A', time: '10 menit lalu' },
    { id: 2, user: 'Jane Smith', action: 'Mengupdate QC Form', project: 'Jalan Tol B', time: '25 menit lalu' },
    { id: 3, user: 'Robert Johnson', action: 'Mengupload dokumen', project: 'Bandara C', time: '1 jam lalu' },
    { id: 4, user: 'Sarah Williams', action: 'Menambahkan anggota tim', project: 'Gedung A', time: '2 jam lalu' },
  ];

  const stats = [
    { title: "Total Proyek", value: "26", change: "+12%", icon: <HardHat className="w-6 h-6" />, trend: "up" },
    { title: "Anggota Tim", value: "48", change: "+5%", icon: <Users className="w-6 h-6" />, trend: "up" },
    { title: "Laporan Bulan Ini", value: "124", change: "-3%", icon: <FileText className="w-6 h-6" />, trend: "down" },
    { title: "Insiden", value: "2", change: "-50%", icon: <AlertTriangle className="w-6 h-6" />, trend: "down" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-md">
        <div className="flex items-center justify-center h-16 px-4 bg-[#0D47A1] text-white">
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>
        <nav className="p-4">
          <div className="space-y-1">
            <button className="flex items-center w-full px-4 py-3 text-sm font-medium text-white bg-[#2196F3] rounded-lg">
              <LayoutDashboard className="w-5 h-5 mr-3" />
              Dashboard
            </button>
            <button className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
              <Users className="w-5 h-5 mr-3" />
              Manajemen User
            </button>
            <button className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
              <HardHat className="w-5 h-5 mr-3" />
              Manajemen Proyek
            </button>
            <button className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
              <ClipboardList className="w-5 h-5 mr-3" />
              Laporan Harian
            </button>
            <button className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
              <FileText className="w-5 h-5 mr-3" />
              QC & K3
            </button>
            <button className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
              <Settings className="w-5 h-5 mr-3" />
              Pengaturan
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2196F3]"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
            <div className="flex items-center">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-700 font-medium">AD</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <div className={`flex items-center mt-2 text-sm ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                    {stat.trend === "up" ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
                    {stat.change}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-blue-50 text-[#2196F3]">
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Project Activity Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Aktivitas Proyek</h3>
              <select className="text-sm border border-gray-200 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[#2196F3]">
                <option>6 Bulan Terakhir</option>
                <option>Tahun Ini</option>
                <option>Tahun Lalu</option>
              </select>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="active" fill="#2196F3" name="Proyek Aktif" />
                  <Bar dataKey="completed" fill="#00C49F" name="Proyek Selesai" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Project Status Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Status Proyek</h3>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-1" />
                Update Terakhir: Hari Ini
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={projectStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {projectStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Activities & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-lg mb-4">Aktivitas Terkini</h3>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3 mt-1">
                    <span className="text-gray-700 text-sm font-medium">
                      {activity.user.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium">{activity.user}</div>
                    <div className="text-sm text-gray-600">{activity.action} - {activity.project}</div>
                    <div className="text-xs text-gray-400 mt-1">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200">
                <Users className="w-5 h-5 mr-3 text-[#2196F3]" />
                Tambah User Baru
              </button>
              <button className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200">
                <HardHat className="w-5 h-5 mr-3 text-[#2196F3]" />
                Buat Proyek Baru
              </button>
              <button className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200">
                <FileText className="w-5 h-5 mr-3 text-[#2196F3]" />
                Generate Laporan
              </button>
              <button className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200">
                <Settings className="w-5 h-5 mr-3 text-[#2196F3]" />
                Pengaturan Sistem
              </button>
            </div>

            {/* Upcoming Deadlines */}
            <div className="mt-8">
              <h3 className="font-semibold text-lg mb-4">Deadline Mendatang</h3>
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                  <div className="mr-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-orange-500" />
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">Laporan QC Gedung A</div>
                    <div className="text-sm text-gray-600">Deadline: Besok</div>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <div className="mr-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <ClipboardList className="w-5 h-5 text-blue-500" />
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">Review Proyek Jalan Tol</div>
                    <div className="text-sm text-gray-600">Deadline: 3 hari lagi</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;