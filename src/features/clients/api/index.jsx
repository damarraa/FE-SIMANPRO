import api from "../../../api";

export const getClients = async ({ page = 1, search = "" }) => {
  const response = await api.get("/v1/clients", {
    params: {
      page,
      search,
    },
  });
  return response.data;
};

export const createClients = async (data) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    formData.append(key, data[key]);
  });

  const response = await api.post("/v1/clients", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getClient = async (id) => {
  const response = await api.get(`/v1/clients/${id}`);
  return response.data;
};

export const updateClient = async (id, data) => {
  if (data instanceof FormData) {
    const response = await api.post(`/v1/clients/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }

  const response = await api.put(`/v1/clients/${id}`, data);
  return response.data;
};