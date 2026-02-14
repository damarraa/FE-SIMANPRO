import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import { addTeamMember, removeTeamMember } from "../api/team";
import { Plus, Trash2 } from "lucide-react";
import AddTeamMemberForm from "./AddTeamMemberForm";
import Swal from "sweetalert2";

const ProjectTeamTable = ({ team = [], isLoading, onDataUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id: projectId } = useParams();
  const [apiError, setApiError] = useState("");

  const user = useAuthStore((state) => state.user);
  const firstRole = user?.roles?.[0];
  const userRole =
    (typeof firstRole === "object" ? firstRole.name : firstRole) || "Guest";

  const hasFullAccess = ["Project Manager", "Admin", "Super Admin"].includes(
    userRole
  );

  const handleSave = async (selectedMember, roleInProject) => {
    setIsSubmitting(true);
    setApiError("");
    try {
      const dataToSubmit = {
        project_id: projectId,
        role_in_project: roleInProject,
      };

      if (selectedMember?.__isNew__) {
        dataToSubmit.contact_id = selectedMember.value.split("-")[1];
      } else {
        const [type, id] = selectedMember.value.split("-");
        if (type === "user") {
          dataToSubmit.user_id = id;
        } else if (type === "contact") {
          dataToSubmit.contact_id = id;
        }
      }

      await addTeamMember(projectId, dataToSubmit);

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Anggota tim berhasil ditambahkan!",
        showConfirmButton: false,
        timer: 1500,
      });

      setShowForm(false);
      onDataUpdate();
    } catch (error) {
      // console.error("Gagal menambah anggota tim", error);

      if (error.response?.status === 422) {
        const messages = Object.values(error.response.data.errors).flat();
        setApiError(messages.join(" "));

        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
        });
        Toast.fire({
          icon: "warning",
          title: "Periksa kembali inputan Anda.",
        });
      } else {
        setApiError("Terjadi kesalahan saat menyimpan data.");
        Swal.fire({
          icon: "error",
          title: "Gagal!",
          text:
            error.response?.data?.message || "Terjadi kesalahan pada server.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemove = async (membershipId) => {
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Anggota ini akan dihapus dari tim proyek.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await removeTeamMember(projectId, membershipId);
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
        });
        Toast.fire({
          icon: "success",
          title: "Anggota tim berhasil dihapus.",
        });

        onDataUpdate();
      } catch (error) {
        console.error("Gagal menghapus anggota tim", error);
        Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: error.message || "Gagal menghapus data.",
        });
      }
    }

    // console.log("Attempting to remove membership ID:", membershipId);
    // if (
    //   window.confirm("Apakah Anda yakin ingin menghapus anggota ini dari tim?")
    // ) {
    //   try {
    //     await removeTeamMember(projectId, membershipId);
    //     onDataUpdate();
    //   } catch (error) {
    //     console.error("Gagal menghapus anggota tim", error);
    //     alert(error.message);
    //   }
    // }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Tim Proyek</h3>
        {hasFullAccess && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
          >
            <Plus size={16} />
            Tambah Anggota
          </button>
        )}
      </div>

      {showForm && (
        <>
          <AddTeamMemberForm
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setApiError("");
            }}
            isLoading={isSubmitting}
          />
          {apiError && <p className="text-red-500 text-sm mt-2">{apiError}</p>}
        </>
      )}

      {isLoading && <p>Loading data tim...</p>}

      {!isLoading && team.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Nama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Peran di Proyek
                </th>
                {hasFullAccess && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">
                    Aksi
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {team.map((member) => {
                // DEBUG: Log setiap member
                // console.log("Rendering member:", member);
                // console.log("membership_id:", member.membership_id);
                // console.log("id:", member.id);

                return (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {member.name}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {member.email || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {member.role_in_project}
                    </td>
                    {hasFullAccess && (
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                        <button
                          onClick={() => {
                            console.log(
                              "Clicked remove for membership_id:",
                              member.membership_id
                            );
                            handleRemove(member.id);
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
              {/* {team.map((member) => (
                <tr key={member.membership_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {member.name}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {member.email || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {member.role_in_project}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                    <button
                      onClick={() => handleRemove(member.membership_id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))} */}
            </tbody>
          </table>
        </div>
      )}

      {!isLoading && (!team || team.length === 0) && (
        <div className="bg-white text-center py-8 rounded-xl shadow-sm">
          <p className="text-gray-500">
            Belum ada anggota tim yang ditambahkan.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProjectTeamTable;
