import api from "../../../api";

export const getMaterialRequisitions = async ({ page = 1, search = "" }) => {
  const response = await api.get("/v1/material-requisitions", {
    params: {
      page,
      search,
    },
  });
  return response.data;
};

export const createMaterialRequisition = async (data) => {
  const response = await api.post("/v1/material-requisitions", data);
  return response.data;
};

export const getMaterialRequisition = async (id) => {
  const response = await api.get(`/v1/material-requisitions/${id}`);
  return response.data;
};

export const updateMaterialRequisition = async (id, data) => {
  const response = await api.put(`/v1/material-requisitions/${id}`, data);
  return response.data;
};
