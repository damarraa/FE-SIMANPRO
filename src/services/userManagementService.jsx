import api from "../api";

export const userManagementApi = {
  getEmployees: (
    page = 1,
    search = "",
    // sortBy = "role_custom",
    sortBy = "employee_id",
    sortDirection = "asc"
  ) =>
    api.get(`/v1/employees`, {
      params: {
        page,
        search,
        sort_by: sortBy,
        sort_direction: sortDirection,
      },
    }),

  // getEmployees: (page = 1, search = "") =>
  //   api.get(`/v1/employees?page=${page}&search=${search}`),

  getEmployeeDetail: (id) => api.get(`/v1/employees/${id}`),

  createEmployee: (data) => api.post("/v1/employees", data),
  updateEmployee: (id, data) => api.put(`/v1/employees/${id}`, data),
  deleteEmployee: (id) => api.delete(`/v1/employees/${id}`),
};
