import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit2, Shield, Lock, CheckCircle2 } from "lucide-react";
import { rbacApi } from "../../services/rbacService";
import Swal from "sweetalert2";

const formatLabel = (str) => {
  if (!str) return "";
  return str.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
};

const RoleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        setLoading(true);
        const response = await rbacApi.getRoleDetail(id);
        setRole(response.data);
      } catch (error) {
        // console.error("Gagal memuat detail role", error);
        Swal.fire({
          icon: "error",
          title: "Data Tidak Ditemukan",
          text: "Detail role tidak dapat dimuat.",
          confirmButtonText: "Kembali",
        }).then(() => {
          navigate("/roles");
        });
      } finally {
        setLoading(false);
      }
    };
    fetchRole();
  }, [id, navigate]);

  const groupedPermissions = useMemo(() => {
    if (!role || !role.permissions) return {};

    return role.permissions.reduce((groups, perm) => {
      const parts = perm.name.split("::");

      if (parts.length >= 2) {
        const action = parts[0];
        const resource = parts[1];

        if (!groups[resource]) groups[resource] = [];
        groups[resource].push(formatLabel(action));
      } else {
        const fallbackGroup = "General";
        if (!groups[fallbackGroup]) groups[fallbackGroup] = [];
        groups[fallbackGroup].push(formatLabel(perm.name));
      }

      return groups;
    }, {});
  }, [role]);

  if (loading)
    return (
      <div className="p-8 text-center text-gray-500">Memuat detail role...</div>
    );
  if (!role) return null;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate("/roles")}
          className="flex items-center text-gray-600 hover:text-[#0D47A1] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Kembali ke Roles
        </button>
        <button
          onClick={() => navigate(`/roles/${id}/edit`)}
          className="flex items-center gap-2 bg-[#2196F3] text-white px-4 py-2 rounded-lg hover:bg-blue-600 shadow-sm transition-colors"
        >
          <Edit2 className="w-4 h-4" />
          Edit Akses
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="bg-blue-100 p-3 rounded-full text-[#0D47A1]">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{role.name}</h1>
            <p className="text-gray-500 mt-1">
              ID:{" "}
              <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                {role.id}
              </span>
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
                Total Izin: <b>{role.permissions.length}</b> akses
              </span>
              {role.name === "Super Admin" && (
                <span className="text-sm text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> System Role
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <h3 className="text-lg font-bold text-[#0D47A1] mb-4 pl-1">
        Daftar Hak Akses (Permissions)
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.keys(groupedPermissions).map((resource) => (
          <div
            key={resource}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm"
          >
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h4 className="font-bold text-[#0D47A1] text-sm flex items-center gap-2 capitalize">
                {formatLabel(resource)} Module
              </h4>
            </div>

            <div className="p-4">
              <ul className="grid grid-cols-2 gap-y-2 gap-x-1">
                {groupedPermissions[resource].map((action, idx) => (
                  <li
                    key={idx}
                    className="flex items-center text-sm text-gray-600"
                  >
                    <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="leading-tight">{action}</span>
                    {/* <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span> */}
                    {/* {action} */}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {(!role.permissions || role.permissions.length === 0) && (
        <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <Shield className="w-12 h-12 text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">
            Role ini belum memiliki izin akses apapun.
          </p>
          <button
            onClick={() => navigate(`/roles/${id}/edit`)}
            className="mt-4 text-sm text-blue-600 hover:underline"
          >
            Assign Permission Sekarang
          </button>
        </div>
      )}

      {/* {role.permissions.length === 0 && (
        <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500">
          Role ini belum memiliki izin akses apapun.
        </div>
      )} */}
    </div>
  );
};

export default RoleDetailPage;
