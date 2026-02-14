import api from "../../../api";

export const getLeaveRequests = async (params) => {
  const response = await api.get("/v2/leaves", { params });
  return response.data;
};

export const getLeaveDetail = async (id) => {
  const response = await api.get(`/v2/leaves/${id}`);
  return response.data;
};

export const createLeaveRequest = async (formData) => {
  const response = await api.post("/v2/leaves", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateLeaveStatus = async (id, status, rejectionReason = null) => {
  const response = await api.put(`/v2/leaves/${id}/approval`, {
    status,
    rejection_reason: rejectionReason,
  });
  return response.data;
};

export const exportLeavePdf = async (id) => {
  const response = await api.get(`/v2/leaves/${id}/export`, {
    responseType: "blob",
  });
  return response.data;
};
