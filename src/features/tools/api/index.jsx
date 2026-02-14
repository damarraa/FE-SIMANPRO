import api from "../../../api";

export const getTools = async ({ page = 1, search = "" }) => {
  const response = await api.get("/v1/tools", {
    params: {
      page,
      search,
    },
  });
  return response.data;
};

export const createTool = async (data) => {
  let payload = data;
  if (!(data instanceof FormData)) {
    const formData = new FormData();
    Object.keys(data).forEach((key) => formData.append(key, data[key]));
    payload = formData;
  }

  const response = await api.post("/v1/tools", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getTool = async (id) => {
  const response = await api.get(`/v1/tools/${id}`);
  return response.data;
};

export const updateTool = async (id, data) => {
  const response = await api.post(`/v1/tools/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};