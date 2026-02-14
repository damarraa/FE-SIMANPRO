import api from "../../../api";

export const getDepartments = async (params) => {
  const response = await api.get("/v2/departments", { params });
  return response.data;
};

export const getDepartmentDetail = async (id) => {
  const response = await api.get(`/v2/departments/${id}`);
  return response.data;
};

export const createDepartment = async (data) => {
  const response = await api.post("/v2/departments", data);
  return response.data;
};

export const updateDepartment = async (id, data) => {
  const response = await api.put(`/v2/departments/${id}`, data);
  return response.data;
};

export const deleteDepartment = async (id) => {
  const response = await api.delete(`/v2/departments/${id}`);
  return response.data;
};
