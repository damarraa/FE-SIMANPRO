import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "../routes";
import { useAuthStore } from "../store/authStore";
const AttendanceRouteHandler = lazy(() => import("./AttendanceRouteHandler"));
// Layout dan Page
import DashboardLayout from "../layouts/DashboardLayout";
const LoginPage = lazy(() => import("../features/auth/LoginPage"));
const RegisterPage = lazy(() => import("../features/auth/RegisterPage"));
const EditProfilePage = lazy(() =>
  import("../features/profile/EditProfilePage")
);
const DashboardPage = lazy(() => import("../features/dashboard/DashboardPage"));
const ForgotPasswordPage = lazy(() =>
  import("../features/auth/ForgotPasswordPage")
);
const ResetPasswordPage = lazy(() =>
  import("../features/auth/ResetPasswordPage")
);
// --- Project ---
const ProjectListPage = lazy(() =>
  import("../features/projects/ProjectListPage")
);
const ProjectCreatePage = lazy(() =>
  import("../features/projects/ProjectCreatePage")
);
const ProjectDetailPage = lazy(() =>
  import("../features/projects/ProjectDetailPage")
);
// -- Nested RAB
const WorkItemDetailPage = lazy(() =>
  import("../features/projects/WorkItemDetailPage")
);
// -- Nested Daily Report
const DailyReportCreatePage = lazy(() =>
  import("../features/projects/DailyReportCreatePage")
);
const DailyReportDetailPage = lazy(() =>
  import("../features/projects/DailyReportDetailPage")
);
// --- Warehouse ---
const WarehouseListPage = lazy(() =>
  import("../features/warehouses/WarehouseListPage")
);
const WarehouseCreatePage = lazy(() =>
  import("../features/warehouses/WarehouseCreatePage")
);
const WarehouseDetailPage = lazy(() =>
  import("../features/warehouses/WarehouseDetailPage")
);
// --- Material ---
const MaterialListPage = lazy(() =>
  import("../features/materials/MaterialListPage")
);
const MaterialCreatePage = lazy(() =>
  import("../features/materials/MaterialCreatePage")
);
const MaterialDetailPage = lazy(() =>
  import("../features/materials/MaterialDetailPage")
);
// --- Alat ---
const ToolListPage = lazy(() => import("../features/tools/ToolListPage"));
const ToolCreatePage = lazy(() => import("../features/tools/ToolCreatePage"));
const ToolDetailPage = lazy(() => import("../features/tools/ToolDetailPage"));
// -- Pergerakan Stok
const StockMovementListPage = lazy(() =>
  import("../features/stock-movements/StockMovementListPage")
);
const StockMovementCreatePage = lazy(() =>
  import("../features/stock-movements/StockMovementsCreatePage")
);
// --- Supplier ---
const SupplierListPage = lazy(() =>
  import("../features/suppliers/SupplierListPage")
);
const SupplierCreatePage = lazy(() =>
  import("../features/suppliers/SupplierCreatePage")
);
const SupplierDetailPage = lazy(() =>
  import("../features/suppliers/SupplierDetailPage")
);
// --- Client ---
const ClientListPage = lazy(() => import("../features/clients/ClientListPage"));
const ClientCreatePage = lazy(() =>
  import("../features/clients/ClientCreatePage")
);
const ClientDetailPage = lazy(() =>
  import("../features/clients/ClientDetailPage")
);
// --- Vehicle ---
const VehicleListPage = lazy(() =>
  import("../features/vehicles/VehiclesListPage")
);
const VehicleCreatePage = lazy(() =>
  import("../features/vehicles/VehiclesCreatePage")
);
const VehicleDetailPage = lazy(() =>
  import("../features/vehicles/VehiclesDetailPage")
);
// --- Penugasan Kendaraan ---
const VehicleAssignmentListPage = lazy(() =>
  import("../features/vehicles/VehicleAssignmentListPage")
);
// --- Purchase Order ---
const PurchaseOrderListPage = lazy(() =>
  import("../features/purchase-orders/PurchaseOrderListPage")
);
const PurchaseOrderCreatePage = lazy(() =>
  import("../features/purchase-orders/PurchaseOrderCreatePage")
);
const PurchaseOrderDetailPage = lazy(() =>
  import("../features/purchase-orders/PurchaseOrderDetailPage")
);
// --- Permintaan Material ---
const MaterialRequisitionListPage = lazy(() =>
  import("../features/material-requisitions/MaterialRequisitionListPage")
);
const MaterialRequisitionCreatePage = lazy(() =>
  import("../features/material-requisitions/MaterialRequisitionCreatePage")
);
const MaterialRequisitionDetailPage = lazy(() =>
  import("../features/material-requisitions/MaterialRequisitionDetailPage")
);
// --- Permintaan Alat ---
const ToolRequisitionListPage = lazy(() =>
  import("../features/tool-requisitions/ToolRequisitionListPage")
);
const ToolRequisitionCreatePage = lazy(() =>
  import("../features/tool-requisitions/ToolRequisitionCreatePage")
);
const ToolRequisitionDetailPage = lazy(() =>
  import("../features/tool-requisitions/ToolRequisitionDetailPage")
);
// --- Permintaan Kendaraan dan Alat Berat ---
const VehicleRequisitionListPage = lazy(() =>
  import("../features/vehicle-requisitions/VehicleRequisitionListPage")
);
const VehicleRequisitionCreatePage = lazy(() =>
  import("../features/vehicle-requisitions/VehicleRequisitionCreatePage")
);
const VehicleRequisitionDetailPage = lazy(() =>
  import("../features/vehicle-requisitions/VehicleRequisitionDetailPage")
);
const ProjectVehicleRequisitionsPage = lazy(() =>
  import("../features/projects/ProjectVehicleRequisitionsPage")
);
// --- RBAC ---
const RoleListPage = lazy(() => import("../features/rbac/RoleListPage"));
const RoleCreatePage = lazy(() => import("../features/rbac/RoleCreatePage"));
const RoleDetailPage = lazy(() => import("../features/rbac/RoleDetailPage"));
// --- Employee ---
const EmployeeListPage = lazy(() =>
  import("../features/rbac/EmployeeListPage")
);
const EmployeeFormPage = lazy(() =>
  import("../features/rbac/EmployeeFormPage")
);
const EmployeeDetailPage = lazy(() =>
  import("../features/rbac/EmployeeDetailPage")
);
// --- Absensi ---
const AttendancePage = lazy(() =>
  import("../features/attendance/AttendancePage")
);
const AttendanceListPage = lazy(() =>
  import("../features/attendance/AttendanceListPage")
);
// --- Department ---
const DepartmentListPage = lazy(() =>
  import("../features/department/DepartmentListPage")
);
const DepartmentCreatePage = lazy(() =>
  import("../features/department/DepartmentCreatePage")
);
const DepartmentDetailPage = lazy(() =>
  import("../features/department/DepartmentDetailPage")
);
// --- Office Location ---
const OfficeLocationListPage = lazy(() =>
  import("../features/office-locations/OfficeLocationListPage")
);
const OfficeLocationCreatePage = lazy(() =>
  import("../features/office-locations/OfficeLocationCreatePage")
);
const OfficeLocationDetailPage = lazy(() =>
  import("../features/office-locations/OfficeLocationDetailPage")
);
// --- Cuti & Izin ---
const LeaveListPage = lazy(() => import("../features/leaves/LeaveListPage"));
const LeaveRequestPage = lazy(() =>
  import("../features/leaves/LeaveRequestPage")
);
const LeaveDetailPage = lazy(() =>
  import("../features/leaves/LeaveDetailPage")
);
// --- Payroll ---
const PayrollListPage = lazy(() =>
  import("../features/payroll/PayrollListPage")
);
const PayrollCreatePage = lazy(() =>
  import("../features/payroll/PayrollCreatePage")
);
const PayrollDetailPage = lazy(() =>
  import("../features/payroll/PayrollDetailPage")
);
// --- PDO/Reimburse ---
const PdoListPage = lazy(() => import("../features/pdo/PdoListPage"));
const PdoCreatePage = lazy(() => import("../features/pdo/PdoCreatePage"));
const PdoDetailPage = lazy(() => import("../features/pdo/PdoDetailPage"));

const ProtectedRoute = ({ children }) => {
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
  {
    path: ROUTES.FORGOT_PASSWORD,
    element: <ForgotPasswordPage />,
  },
  {
    path: ROUTES.RESET_PASSWORD,
    element: <ResetPasswordPage />,
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
          {
            path: "profile",
            element: <EditProfilePage />,
          },
          // --- RBAC ---
          {
            path: "roles",
            element: <RoleListPage />,
          },
          {
            path: "roles/create",
            element: <RoleCreatePage />,
          },
          {
            path: "roles/:id",
            element: <RoleDetailPage />,
          },
          {
            path: "roles/:id/edit",
            element: <RoleCreatePage />,
          },
          // --- Employee ---
          {
            path: "employees",
            element: <EmployeeListPage />,
          },
          {
            path: "employees/create",
            element: <EmployeeFormPage />,
          },
          {
            path: "employees/:id",
            element: <EmployeeDetailPage />,
          },
          {
            path: "employees/:id/edit",
            element: <EmployeeFormPage />,
          },
          // --- Presensi ---
          {
            path: "attendance",
            element: <AttendanceRouteHandler />,
          },
          {
            path: "attendance/create",
            element: <AttendancePage />,
          },
          // --- Cuti & Izin ---
          {
            path: "leaves",
            element: <LeaveListPage />,
          },
          {
            path: "leaves/create",
            element: <LeaveRequestPage />,
          },
          {
            path: "leaves/:id",
            element: <LeaveDetailPage />,
          },
          // --- Department ---
          {
            path: "departments",
            element: <DepartmentListPage />,
          },
          {
            path: "departments/create",
            element: <DepartmentCreatePage />,
          },
          {
            path: "departments/:id",
            element: <DepartmentDetailPage />,
          },
          {
            path: "departments/:id/edit",
            element: <DepartmentCreatePage />,
          },
          // --- Office Location ---
          {
            path: "office-locations",
            element: <OfficeLocationListPage />,
          },
          {
            path: "office-locations/create",
            element: <OfficeLocationCreatePage />,
          },
          {
            path: "office-locations/:id",
            element: <OfficeLocationDetailPage />,
          },
          // --- Payroll ---
          {
            path: "payrolls",
            element: <PayrollListPage />,
          },
          {
            path: "payrolls/create",
            element: <PayrollCreatePage />,
          },
          {
            path: "payrolls/:id",
            element: <PayrollDetailPage />,
          },
          // --- Reimburse ---
          {
            path: "pdos",
            element: <PdoListPage />,
          },
          {
            path: "pdos/create",
            element: <PdoCreatePage />,
          },
          {
            path: "pdos/:id",
            element: <PdoDetailPage />,
          },
          {
            path: "pdos/:id/edit",
            element: <PdoDetailPage />,
          },
          // --- Project ---
          {
            path: "projects",
            element: <ProjectListPage />,
          },
          {
            path: "projects/create",
            element: <ProjectCreatePage />,
          },
          {
            path: "projects/:id",
            element: <ProjectDetailPage />,
          },
          {
            path: "projects/:id/vehicle-requisitions",
            element: <ProjectVehicleRequisitionsPage />,
          },
          {
            path: "work-items/:id",
            element: <WorkItemDetailPage />,
          },
          {
            path: "projects/:projectId/daily-reports/create",
            element: <DailyReportCreatePage />,
          },
          {
            path: "daily-reports/:id",
            element: <DailyReportDetailPage />,
          },
          // --- Inventory & Material ---
          {
            path: "warehouses",
            element: <WarehouseListPage />,
          },
          {
            path: "warehouses/create",
            element: <WarehouseCreatePage />,
          },
          {
            path: "warehouses/:id",
            element: <WarehouseDetailPage />,
          },
          {
            path: "materials",
            element: <MaterialListPage />,
          },
          {
            path: "materials/create",
            element: <MaterialCreatePage />,
          },
          {
            path: "materials/:id",
            element: <MaterialDetailPage />,
          },
          {
            path: "tools",
            element: <ToolListPage />,
          },
          {
            path: "tools/create",
            element: <ToolCreatePage />,
          },
          {
            path: "tools/:id",
            element: <ToolDetailPage />,
          },
          {
            path: "suppliers",
            element: <SupplierListPage />,
          },
          {
            path: "suppliers/create",
            element: <SupplierCreatePage />,
          },
          {
            path: "suppliers/:id",
            element: <SupplierDetailPage />,
          },
          {
            path: "clients",
            element: <ClientListPage />,
          },
          {
            path: "clients/create",
            element: <ClientCreatePage />,
          },
          {
            path: "clients/:id",
            element: <ClientDetailPage />,
          },
          {
            path: "stock-movements",
            element: <StockMovementListPage />,
          },
          {
            path: "stock-movements/create",
            element: <StockMovementCreatePage />,
          },
          // --- Finance ---
          {
            path: "purchase-orders",
            element: <PurchaseOrderListPage />,
          },
          {
            path: "purchase-orders/create",
            element: <PurchaseOrderCreatePage />,
          },
          {
            path: "purchase-orders/:id",
            element: <PurchaseOrderDetailPage />,
          },
          {
            path: "material-requisitions",
            element: <MaterialRequisitionListPage />,
          },
          {
            path: "material-requisitions/create",
            element: <MaterialRequisitionCreatePage />,
          },
          {
            path: "material-requisitions/:id",
            element: <MaterialRequisitionDetailPage />,
          },
          {
            path: "tool-requisitions",
            element: <ToolRequisitionListPage />,
          },
          {
            path: "tool-requisitions/create",
            element: <ToolRequisitionCreatePage />,
          },
          {
            path: "tool-requisitions/:id",
            element: <ToolRequisitionDetailPage />,
          },
          {
            path: "vehicle-requisitions",
            element: <VehicleRequisitionListPage />,
          },
          {
            path: "vehicle-requisitions/create",
            element: <VehicleRequisitionCreatePage />,
          },
          {
            path: "vehicle-requisitions/:id",
            element: <VehicleRequisitionDetailPage />,
          },
          // --- Vehicle ---
          {
            path: "vehicles",
            element: <VehicleListPage />,
          },
          {
            path: "vehicles/create",
            element: <VehicleCreatePage />,
          },
          {
            path: "vehicles/:id",
            element: <VehicleDetailPage />,
          },
          {
            path: "vehicle-assignments",
            element: <VehicleAssignmentListPage />,
          },
        ],
      },
    ],
  },
]);

export default router;
