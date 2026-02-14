import React, { useEffect } from "react";
import { ArrowLeft, Building, Users, Tag, Calendar } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import useDepartments from "./hooks/useDepartments";
import { getImageUrl } from "../../utils/image";

const DepartmentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { departmentDetail, isLoading, fetchDetail } = useDepartments();

  useEffect(() => {
    fetchDetail(id);
  }, [id, fetchDetail]);

  if (isLoading)
    return <div className="p-8 text-center text-gray-500">Loading...</div>;
  if (!departmentDetail)
    return (
      <div className="p-8 text-center text-gray-500">Data tidak ditemukan.</div>
    );

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <button
        onClick={() => navigate("/departments")}
        className="flex items-center text-gray-500 hover:text-blue-600 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke List
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl flex-shrink-0">
            <Building size={40} />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">
                {departmentDetail.name}
              </h1>
              <span className="px-2 py-1 bg-gray-100 border border-gray-200 text-gray-600 rounded text-xs font-mono font-bold flex items-center gap-1">
                <Tag size={12} /> {departmentDetail.code}
              </span>
            </div>

            <p className="text-gray-600 leading-relaxed mb-4">
              {departmentDetail.description ||
                "Tidak ada deskripsi untuk departemen ini."}
            </p>

            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                <Users size={16} className="text-blue-500" />
                <span className="font-medium text-gray-900">
                  {departmentDetail.users_count}
                </span>{" "}
                Anggota
              </div>
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                <Calendar size={16} className="text-green-500" />
                Dibuat:{" "}
                {new Date(departmentDetail.created_at).toLocaleDateString(
                  "id-ID"
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#0D47A1]" /> Daftar Anggota
            Departemen
          </h3>
        </div>

        <div className="divide-y divide-gray-100">
          {departmentDetail.users && departmentDetail.users.length > 0 ? (
            departmentDetail.users.map((user) => (
              <div
                key={user.id}
                className="p-4 flex items-center gap-4 hover:bg-blue-50/50 transition cursor-pointer group"
                onClick={() => navigate(`/employees/${user.id}`)}
              >
                <img
                  src={getImageUrl(user.profile_picture)}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user.name
                    )}&background=random`;
                  }}
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {user.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {user.job_title || "Staff"} • {user.email}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center flex flex-col items-center justify-center text-gray-400">
              <Users size={48} className="mb-3 text-gray-200" />
              <p>Belum ada anggota di departemen ini.</p>
              <button
                onClick={() => navigate("/employees")}
                className="mt-4 text-blue-600 hover:underline text-sm"
              >
                Assign Karyawan Sekarang
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetailPage;
