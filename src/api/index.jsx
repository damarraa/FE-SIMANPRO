import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://5c8c1e55a582.ngrok-free.app/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    // Authorization: `Bearer ${token}`,
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
