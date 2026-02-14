import api from "../../../api";

export const getProjects = async (params) => {
  const response = await api.get("/v1/projects", { params });
  return response.data;
};

// export const getProjects = async ({ page = 1, search = "" }) => {
//   const response = await api.get("/v1/projects", {
//     params: {
//       page,
//       search,
//     },
//   });
//   return response.data;
// };

export const getProject = async (id) => {
  const response = await api.get(`/v1/projects/${id}`);
  return response.data;
};

export const updateProject = async (id, data) => {
  const response = await api.put(`/v1/projects/${id}`, data);
  return response.data;
};
