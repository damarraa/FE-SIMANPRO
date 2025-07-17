import { HiOutlineViewGrid } from "react-icons/hi";

const DASHBOARD_SIDEBAR_LINKS = [
  {
    key: "dashboard",
    label: "Dashboard",
    path: "/dashboard",
    icon: <HiOutlineViewGrid />,
    allowdRoles: ['Super Admin', 'Admin', 'Project Manager', 'Logistic'],
  },
  {
    key: "project",
    label: "Project",
    path: "/project",
  },
  {
    key: "warehouse",
    label: "Warehouse",
    path: "/warehouse",
  },
  {
    key: "material",
    label: "Material",
    path: "/material",
  },
  {
    key: "inventory",
    label: "Inventory",
    path: "/inventory",
  },
  // Keseluruhan route menyusul
];
