import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../api";

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      isLoggedIn: false,
      login: async (email, password) => {
        const response = await api.post("/v1/login", { email, password });
        const { token, user } = response.data;
        localStorage.setItem("token", token);
        set({ token, user, isLoggedIn: true });
      },
      register: async (userData) => {
        await api.post("/v1/register", userData);
      },
      logout: async () => {
        try {
          await api.post("/v1/logout");
        } catch (error) {
          console.error("API logout gagal, tetap logout di frontend.", error);
        } finally {
          localStorage.removeItem("token");
          set({ token: null, user: null, isLoggedIn: false });
        }
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
