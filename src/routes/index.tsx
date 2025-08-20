import App from "@/App";
import DashboardLayout from "@/components/layout/DashboardLayout";
import About from "@/pages/About";
import LoginPage from "@/pages/Login";
import RegisterPage from "@/pages/Register";
import Verify from "@/pages/Verify";
import { generateRoutes } from "@/utils/generateRoutes";

import { createBrowserRouter, Navigate } from "react-router";
import { adminSidebarItems } from "./adminSidebarItems";
import { userSidebarItems } from "./userSidebarItems";
import Unauthorized from "@/pages/Unauthorized";
import { role } from "@/constants/role";
import type { TRole } from "@/types";
import { withAuth } from "@/utils/withAuth";
// import { role } from "@/constants/role";
// import type { TRole } from "@/types";

export const router = createBrowserRouter([
  {
    Component: App,
    path: "/",
    children: [
      {
        Component: About,
        path: "about",
      },
    ],
  },
  {
    Component: withAuth(DashboardLayout, role.superAdmin as TRole),
    path: "/admin",
    children: [{index : true, element : <Navigate to="/admin/analytics"/>} , ...generateRoutes(adminSidebarItems)]
  },
  {
    Component: withAuth(DashboardLayout, role.user as TRole),
    path: "/user",
    children: [{index : true, element : <Navigate to="/user/bookings"/>} , ...generateRoutes(userSidebarItems)]
  },
  {
    Component: LoginPage,
    path: "/login",
  },
  {
    Component: RegisterPage,
    path: "/register",
  },
  {
    Component: Verify,
    path: "/verify",
  },
  {
    Component: Unauthorized,
    path: "/unauthorized",
  },
]);
