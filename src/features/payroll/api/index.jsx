import api from "../../../api";

export const getPayrolls = async (params) => {
  const response = await api.get("/v2/payrolls", { params });
  return response.data;
};

export const getPayrollDetail = async (id) => {
  const response = await api.get(`/v2/payrolls/${id}`);
  return response.data;
};

export const createPayroll = async (data) => {
  const response = await api.post("/v2/payrolls", data);
  return response.data;
};

export const updatePayroll = async (id, data) => {
  const response = await api.put(`/v2/payrolls/${id}`, data);
  return response.data;
};

export const deletePayroll = async (id) => {
  const response = await api.delete(`/v2/payrolls/${id}`);
  return response.data;
};
