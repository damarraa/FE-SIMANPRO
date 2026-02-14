import api from "../../../api";

export const getStockMovements = async ({ page = 1, search = "" }) => {
  const response = await api.get("/v1/stock-movements", {
    params: {
      page,
      search,
    },
  });
  return response.data;
};

export const createStockMovement = async (data) => {
  const response = await api.post("/v1/stock-movements", data);
  return response.data;
};
