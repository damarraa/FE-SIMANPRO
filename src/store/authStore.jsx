import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../api";

export const normalizeUser = (payload) => {
  const user = payload && payload.data ? payload.data : payload;

  let roles = [];
  if (Array.isArray(user.roles) && user.roles.length > 0) {
    if (typeof user.roles[0] === "object") {
      roles = user.roles.map((r) => r.name) ?? [];
    } else {
      roles = user.roles;
    }
  }

  if (
    (!roles || roles.length === 0) &&
    user.role &&
    typeof user.role === "string"
  ) {
    roles = [user.role];
  }

  return {
    ...user,
    roles,
    permissions: Array.isArray(user.permissions) ? user.permissions : [], // New
  };
};

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      isLoggedIn: false,

      /* -------------------------------------------
         LOGIN
      -------------------------------------------- */
      login: async (email, password) => {
        try {
          const response = await api.post("/v1/login", { email, password });
          const payload = response.data;

          const { token, user } = payload;
          const normalized = normalizeUser(user);
          localStorage.setItem("token", token);
          set({ token, user: normalized, isLoggedIn: true });
        } catch (error) {
          console.error("❌ Login error:", error);
          throw error;
        }
      },

      /* -------------------------------------------
         REGISTER
      -------------------------------------------- */
      register: async (userData) => {
        await api.post("/v1/register", userData);
      },

      /* -------------------------------------------
         LOGOUT
      -------------------------------------------- */
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

      /* -------------------------------------------
         REFRESH USER
      -------------------------------------------- */
      refreshUser: async () => {
        try {
          const response = await api.get("/v1/user");
          console.log("🔄 REFRESH USER RESPONSE:", response.data);

          const payload = response.data;
          const normalized = normalizeUser(payload);

          set({ user: normalized });
          return normalized;
        } catch (error) {
          console.error("❌ Gagal refresh user data:", error);
          throw error;
        }
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
