import api from "../../../api";

export const getAssetAssignments = async (toolId) => {
  const response = await api.get(`/v1/tools/${toolId}/asset-assignments`);
  return response.data;
};

export const createAssetAssignment = async (toolId, data) => {
  const response = await api.post(
    `/v1/tools/${toolId}/asset-assignments`,
    data
  );
  return response.data;
};
