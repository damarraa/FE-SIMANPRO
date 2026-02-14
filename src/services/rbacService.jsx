import api from "../api";

export const rbacApi = {
  getRoles: (
    page = 1,
    search = "",
    sortBy = "hierarchy",
    sortDirection = "asc"
  ) =>
    api.get(`/v1/roles`, {
      params: { page, search, sort_by: sortBy, sort_direction: sortDirection },
    }),
  getAllPermissions: () => api.get("/v1/permissions"),
  getRoleDetail: (id) => api.get(`/v1/roles/${id}`),
  createRole: (data) => api.post("/v1/roles", data),
  updateRole: (id, data) => api.put(`/v1/roles/${id}`, data),
  deleteRole: (id) => api.delete(`/v1/roles/${id}`),
};
