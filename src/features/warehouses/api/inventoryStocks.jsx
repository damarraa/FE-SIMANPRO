import api from "../../../api";

export const getInventoryStocks = async (warehouseId) => {
  const response = await api.get(
    `/v1/warehouses/${warehouseId}/inventory-stocks`
  );
  return response.data;
};
