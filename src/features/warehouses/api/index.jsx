import api from "../../../api";

export const getWarehouses = async ({ page = 1, search = "" }) => {
  const response = await api.get("/v1/warehouses", {
    params: {
      page,
      search,
    },
  });
  return response.data;
};

export const createWarehouse = async (data) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    formData.append(key, data[key]);
  });

  const response = await api.post("/v1/warehouses", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getWarehouse = async (id) => {
  const response = await api.get(`/v1/warehouses/${id}`);
  return response.data;
};

export const updateWarehouse = async (id, data) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    formData.append(key, data[key]);
  });
  formData.append("_method", "PUT");

  const response = await api.post(`/v1/warehouses/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
