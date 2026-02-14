import api from "../../../api";

export const getVehicleRequisitions = async ({ page = 1, search = "" }) => {
  const response = await api.get("/v1/vehicle-requisitions", {
    params: {
      page,
      search,
    },
  });

  return response.data;
};

export const createVehicleRequisition = async (data) => {
  const response = await api.post("/v1/vehicle-requisitions", data);
  return response.data;
};

export const getVehicleRequisition = async (id) => {
  const response = await api.get(`/v1/vehicle-requisitions/${id}`);
  return response.data;
};

export const updateVehicleRequisition = async (id, data) => {
  const response = await api.put(`/v1/vehicle-requisitions/${id}`, data);
  return response.data;
};
