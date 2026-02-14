import api from "../../../api";

export const getMyProfile = async () => {
  const response = await api.get("/v1/user");
  const payload = response.data;
  return payload.data ? payload.data : payload;
};

export const updateProfile = async (id, data) => {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key]);
    }
  });

  formData.append("_method", "PUT");

  const response = await api.post(`/v1/users/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  const payload = response.data;
  return payload.data ? payload.data : payload;
};
