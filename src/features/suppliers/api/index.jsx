import api from "../../../api";

export const getSuppliers = async ({ page = 1, search = "" }) => {
  const response = await api.get("/v1/suppliers", {
    params: {
      page,
      search,
    },
  });
  return response.data;
};

export const createSuppliers = async (data) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    formData.append(key, data[key]);
  });

  const response = await api.post("/v1/suppliers", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getSupplier = async (id) => {
  const response = await api.get(`/v1/suppliers/${id}`);
  return response.data;
};

export const updateSupplier = async (id, data) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    formData.append(key, data[key]);
  });
  formData.append("_method", "PUT");

  const response = await api.post(`/v1/suppliers/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
