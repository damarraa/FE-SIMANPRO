const DashboardPage = () => {
  // useState dan useEffect untuk mengambil data dari API.

  return (
    <div className="">
      {/* Stats Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
                <div
                  className={`flex items-center mt-2 text-sm ${
                    stat.trend === "up" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {stat.trend === "up" ? (
                    <ArrowUp className="w-4 h-4 mr-1" />
                  ) : (
                    <ArrowDown className="w-4 h-4 mr-1" />
                  )}
                  {stat.change}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 text-[#2196F3]">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div> */}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Project Activity Chart */}
        {/* <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
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
        </div> */}

        {/* Project Status Chart */}
        {/* <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
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
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div> */}
      </div>

      {/* Recent Activities & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        {/* <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-semibold text-lg mb-4">Aktivitas Terkini</h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0"
              >
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3 mt-1">
                  <span className="text-gray-700 text-sm font-medium">
                    {activity.user
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <div className="font-medium">{activity.user}</div>
                  <div className="text-sm text-gray-600">
                    {activity.action} - {activity.project}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {activity.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div> */}

        {/* Quick Actions */}
        {/* <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
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
          </div> */}

        {/* Upcoming Deadlines */}
        {/* <div className="mt-8">
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
                  <div className="text-sm text-gray-600">
                    Deadline: 3 hari lagi
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default DashboardPage;
