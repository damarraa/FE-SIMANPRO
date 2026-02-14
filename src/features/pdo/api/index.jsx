import api from "../../../api";

export const getPdos = async (params) => {
  const response = await api.get("/v2/pdos", { params });
  return response.data;
};

export const getPdoDetail = async (id) => {
  const response = await api.get(`/v2/pdos/${id}`);
  return response.data;
};

export const createPdo = async (data) => {
  const response = await api.post("/v2/pdos", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updatePdo = async (id, data) => {
  data.append("_method", "PUT");
  const response = await api.post(`/v2/pdos/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// export const deletePdo = async (id) => {
//   const response = await api.delete(`/pdo/${id}`);
//   return response.data;
// };

export const approveFinance = async (id, payload = {}) => {
  const response = await api.put(`/v2/pdos/${id}/approve-finance`, payload);
  return response.data;
};

export const approveDirector = async (id) => {
  const response = await api.put(`/v2/pdos/${id}/approve-director`);
  return response.data;
};
