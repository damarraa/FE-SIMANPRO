import api from "../../../api";

export const getAssetLocations = async (toolId) => {
  const response = await api.get(`/v1/tools/${toolId}/asset-locations`);
  return response.data;
};

export const createAssetLocation = async (toolId, data) => {
  const response = await api.post(`/v1/tools/${toolId}/asset-locations`, data);
  return response.data;
};
