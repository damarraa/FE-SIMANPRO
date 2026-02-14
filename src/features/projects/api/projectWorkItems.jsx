import api from "../../../api";

export const createProjectWorkItem = async ({ name, unit, project_id }) => {
  try {
    const response = await api.post(
      `/v1/projects/${project_id}/work-items/create-from-activity`,
      { name, unit }
    );
    return response.data;
  } catch (error) {
    console.error("Gagal membuat work item baru: ", error.response.data);
    throw error;
  }
};
