import api from "../../../api";

export const getProjectWorkItems = async (projectId) => {
  const response = await api.get(`/v1/projects/${projectId}/work-items`);
  return response.data;
};

export const createProjectWorkItem = async (projectId, data) => {
  const response = await api.post(`/v1/projects/${projectId}/work-items`, data);
  return response.data;
};

export const deleteProjectWorkItem = async (workItemId) => {
  await api.delete(`/v1/work-items/${workItemId}`);
};

/**
 * Mengambil data detail satu item pekerjaan (RAB).
 * @param {string|number} workItemId
 */
export const getWorkItemDetails = async (workItemId) => {
  const response = await api.get(`/v1/work-items/${workItemId}`);
  return response.data;
};

/**
 * Mengupdate data item pekerjaan (RAB), termasuk detail material & jasa.
 * @param {string|number} workItemId
 * @param {object} data
 */
export const updateWorkItem = async (workItemId, data) => {
  const response = await api.put(`/v1/work-items/${workItemId}`, data);
  return response.data;
};

/**
 * -----------------------------------
 * Updated v1.0 - 22/10/25
 * Refactor ke Self-referencing (tree)
 * -----------------------------------
 */

/**
 * Mengambil semua master template pekerjaan.
 */
export const fetchWorkTemplates = async () => {
  const response = await api.get("/v2/work-templates");
  return response.data;
};

/**
 * Membuat master template pekerjaan baru (CreatableSelect).
 */
export const createWorkTemplate = async (data) => {
  const response = await api.post("/v2/work-templates", data);
  return response.data;
};

/**
 * ------------------------------------
 * Original version.
 * Menggunakan table Work > Sub Work.
 * ------------------------------------
 */
export const getWorks = async () => {
  const response = await api.get("/v1/works");
  return response.data;
};

export const getSubWorksByWork = async (workId) => {
  if (!workId) return { data: [] };
  const response = await api.get(`/v1/works/${workId}/sub-works`);
  return response.data;
};

export const createWork = async (data) => {
  const response = await api.post("/v1/works", data);
  return response.data;
};

export const createSubWork = async (workId, data) => {
  const response = await api.post(`/v1/works/${workId}/sub-works`, data);
  return response.data;
};
