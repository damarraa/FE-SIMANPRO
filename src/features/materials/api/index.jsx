import api from "../../../api";

export const getMaterials = async ({ page = 1, search = "" }) => {
  const response = await api.get("/v1/materials", {
    params: {
      page,
      search,
    },
  });
  return response.data;
};

export const createMaterial = async (data) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    formData.append(key, data[key]);
  });

  const response = await api.post("/v1/materials", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getMaterial = async (id) => {
  const response = await api.get(`/v1/materials/${id}`);
  return response.data;
};

export const updateMaterial = async (id, data) => {
  // const formData = new FormData();
  // Object.keys(data).forEach((key) => {
  //   formData.append(key, data[key]);
  // });
  // formData.append("_method", "PUT");

  const response = await api.post(`/v1/materials/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
