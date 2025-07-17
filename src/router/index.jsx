import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "../routes";
// Layout dan Page
import DashboardLayout from "../layouts/DashboardLayout";
import LoginPage from "../features/auth/LoginPage";
import RegisterPage from "../features/auth/RegisterPage";
import DashboardPage from "../features/dashboard/DashboardPage";
import { useAuthStore } from "../store/authStore";

const ProtectedRoute = ({ children }) => {
  /**
   * Update 17/07/25
   * menggunakan state dari Zustand.
   */
  const { isLoggedIn } = useAuthStore();

  if (!isLoggedIn) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
};

const router = createBrowserRouter([
  // --- Public Route ---
  {
    path: ROUTES.LOGIN,
    element: <LoginPage />,
  },
  {
    path: ROUTES.REGISTER,
    element: <RegisterPage />,
  },

  // --- Private Route ---
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/dashboard" replace />,
          },
          {
            path: "dashboard",
            element: <DashboardPage />,
          },
        ],
      },
    ],
  },
]);

export default router;
