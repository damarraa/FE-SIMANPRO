import api from "../../../api";

export const getProjectExpenses = async (projectId) => {
  const response = await api.get(`/v1/projects/${projectId}/expenses`);
  return response.data;
};

export const createProjectExpense = async (projectId, data) => {
  const response = await api.post(`/v1/projects/${projectId}/expenses`, data);
  return response.data;
};

export const updateProjectExpense = async (expenseId, data) => {
  const response = await api.put(`/v1/expenses/${expenseId}`, data);
  return response.data;
};

export const deleteProjectExpense = async (expenseId) => {
  await api.delete(`/v1/expenses/${expenseId}`);
};
