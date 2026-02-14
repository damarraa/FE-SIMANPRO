import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import AttendanceListPage from "../features/attendance/AttendanceListPage";

const AttendanceRouteHandler = () => {
  const user = useAuthStore((state) => state.user);
  const firstRole = user?.roles?.[0];
  const userRole =
    (typeof firstRole === "object" ? firstRole.name : firstRole) || "Guest";
  const monitoringRoles = ["Super Admin", "Admin", "HR"];

  if (monitoringRoles.includes(userRole)) {
    return <AttendanceListPage />;
  } else {
    return <Navigate to="/attendance/create" replace />;
  }
};

export default AttendanceRouteHandler;
