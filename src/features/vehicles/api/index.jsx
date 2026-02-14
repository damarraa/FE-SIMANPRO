import api from "../../../api";

export const getVehicles = async ({ page = 1, search = "" }) => {
  const response = await api.get("/v1/vehicles", {
    params: {
      page,
      search,
    },
  });
  return response.data;
};

export const createVehicle = async (data) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    formData.append(key, data[key]);
  });

  const response = await api.post("/v1/vehicles", formData, {
    headers: { "Content-Type": "multipart/form-date" },
  });
  return response.data;
};

export const getVehicle = async (id) => {
  const response = await api.get(`/v1/vehicles/${id}`);
  return response.data;
};

export const updateVehicle = async (id, data) => {
  let formData;

  if (data instanceof FormData) {
    formData = data;
  } else {
    formData = new FormData();
    Object.keys(data).forEach((key) => {
      if ((key === "document" || key === "picture") && !data[key]) return;
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
  }

  if (!formData.has("_method")) {
    formData.append("_method", "PUT");
  }

  const response = await api.post(`/v1/vehicles/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Nested route
export const getVehicleAssignments = async (vehicleId) => {
  const response = await api.get(
    `/v1/vehicles/${vehicleId}/vehicle-assignments`,
  );
  return response.data;
};

// All assignments
export const getAllVehicleAssignments = async ({ page = 1, search = "" }) => {
  const response = await api.get("/v1/vehicle-assignments", {
    params: {
      page,
      search,
    },
  });
  return response.data;
};

export const createVehicleAssignment = async (vehicleId, data) => {
  const response = await api.post(
    `/v1/vehicles/${vehicleId}/vehicle-assignments`,
    data,
  );
  return response.data;
};

export const updateVehicleAssignment = async (assignmentId, data) => {
  const response = await api.put(
    `/v1/vehicle-assignments/${assignmentId}`,
    data,
  );
  return response.data;
};

export const getMaintenanceLogs = async (vehicleId) => {
  const response = await api.get(`/v1/vehicles/${vehicleId}/maintenance-logs`);
  return response.data;
};

export const createMaintenanceLog = async (data) => {
  const formData = new FormData();
  const { vehicle_id, ...restData } = data;

  Object.keys(restData).forEach((key) => {
    if (restData[key] !== null && restData[key] !== undefined) {
      formData.append(key, restData[key]);
    }
  });

  const response = await api.post(
    `/v1/vehicles/${vehicle_id}/maintenance-logs`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return response.data;
};

// Cek status kendaraan
export const checkVehicleAvailablity = async (vehicleId) => {
  const response = await api.get(`/v1/vehicle-availability/${vehicleId}`);
  return response.data;
};
