import api from "../../../api";

export const getProjectTeam = async (projectId) => {
  const response = await api.get(`/v1/projects/${projectId}/team`);
  return response.data;
};

// Changes 01/09/25
export const addTeamMember = async (projectId, data) => {
  const response = await api.post(`/v1/projects/${projectId}/team`, data);
  return response.data;
};

// addTeamMember v2
/**
 * Mengirimkan data anggota tim yang sudah diformat dari komponen.
 * @param {string|number} projectId
 * @param {object} data - Objek yang berisi user_id/external_member_name dan role_in_project
 */
// export const addTeamMember = async (projectId, data) => {
//   const response = await api.options(`/v1/projects/${projectId}/team`, data);
//   return response.data;
// };

// Original v1
// export const addTeamMember = async (projectId, userId) => {
//   const response = await api.post(`/v1/projects/${projectId}/team`, {
//     user_id: userId,
//   });
//   return response.data;
// };

/**
 * Menghapus anggota tim berdasarkan ID unik dari tabel pivot.
 * @param {string|number} projectId
 * @param {string|number} pivotId - ID dari tabel project_user
 */
export const removeTeamMember = async (projectId, memberId) => {
  try {
    const response = await api.delete(
      `/v1/projects/${projectId}/team/${memberId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error removing team member: ", error);

    if (error.response?.status === 403) {
      throw new Error("Anda tidak memiliki izin untuk menghapus anggota tim");
    }

    if (error.response?.status === 404) {
      throw new Error("Anggota tim tidak ditemukan");
    }

    throw new Error("Terjadi kesalahan saat menghapus anggota tim");
  }
};

// export const removeTeamMember = async (projectId, pivotId) => {
//   await api.delete(`/v1/projects/${projectId}/team/${pivotId}`);
// };

// export const removeTeamMember = async (projectId, memberId) => {
//   await api.delete(`/v1/projects/${projectId}/team/${memberId}`);
// };

// Original
// export const removeTeamMember = async (projectId, userId) => {
//   await api.delete(`/v1/projects/${projectId}/team/${userId}`);
// };
