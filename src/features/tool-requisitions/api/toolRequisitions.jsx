import api from "../../../api";

// export const getToolRequisitions = async (projectId) => {
//   const response = await api.get(`/v1/projects/${projectId}/tool-requisitions`);
//   return response.data;
// };

export const getToolRequisitions = async (params) => {
  const response = await api.get("/v1/tool-requisitions", {
    params: {
      page: params?.page || 1,
      search: params?.searchTerm,
      project_id: params?.project_id,
    },
  });

  return response.data;
};

export const createToolRequisition = async (projectId, data) => {
  const response = await api.post(
    `/v1/projects/${projectId}/tool-requisitions`,
    data
  );
  return response.data;
};

export const getToolRequisition = async (id) => {
  const response = await api.get(`/v1/tool-requisitions/${id}`);
  return response.data;
};

export const updateToolRequisition = async (id, data) => {
  const response = await api.put(`/v1/tool-requisitions/${id}`, data);
  return response.data;
};
