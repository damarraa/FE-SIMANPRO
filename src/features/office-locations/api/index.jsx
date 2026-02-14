import api from "../../../api";

export const getOfficeLocations = async (params) => {
  const response = await api.get("/v2/office-locations", { params });
  return response.data;
};

export const getOfficeLocationDetail = async (id) => {
  const response = await api.get(`/v2/office-locations/${id}`);
  return response.data;
};

export const createOfficeLocation = async (data) => {
  const response = await api.post("/v2/office-locations", data);
  return response.data;
};

export const updateOfficeLocation = async (id, data) => {
  const response = await api.put(`/v2/office-locations/${id}`);
  return response.data;
};

export const deleteOfficeLocation = async (id) => {
  const response = await api.delete(`/v2/office-locations/${id}`);
  return response.data;
};
