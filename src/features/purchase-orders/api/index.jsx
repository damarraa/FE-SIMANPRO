import api from "../../../api";

export const getPurchaseOrders = async ({ page = 1, search = "" }) => {
  const response = await api.get("/v1/purchase-orders", {
    params: { page, search },
  });
  return response.data;
};

export const createPurchaseOrder = async (data) => {
  const response = await api.post("/v1/purchase-orders", data);
  return response.data;
};

export const getPurchaseOrder = async (id) => {
  const response = await api.get(`/v1/purchase-orders/${id}`);
  return response.data;
};

export const updatePurchaseOrder = async (id, data) => {
  const response = await api.put(`/v1/purchase-orders/${id}`, data);
  return response.data;
};
