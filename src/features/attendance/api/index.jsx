import api from "../../../api";

export const getAttendanceHistory = async (params = {}) => {
  const response = await api.get("/v2/attendance/history", { params });
  return response.data;
};

export const checkIn = async (formData) => {
  const response = await api.post("/v2/attendance/check-in", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const checkOut = async (formData) => {
  const response = await api.post("/v2/attendance/check-out", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
