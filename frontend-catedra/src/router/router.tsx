import { createBrowserRouter, Navigate } from "react-router-dom";
import { Animator } from "../components/routes-animations/animator";
import Error from "../pages/error";
import { ProtectedRoute } from "../components/routes/protected-route";
import { AdminDashboard } from "../pages/admin/admin-dashboard";
import { AdminDashboardEmployees } from "../pages/admin/admin-dasboard-employees";
import { AdminDashboardClients } from "../pages/admin/admin-dashboard-clients";
import Login from "../pages/auth/login";
import { DashboardEmployeeClients } from "../pages/employee/dashboard-employee-clients";
import { DashboardEmployeeProducts } from "../pages/employee/dashboard-employee-products";
import { DashboardEmployeeTransactions } from "../pages/employee/dashboard-employee-transactions";
import { UserRole } from "../enums/user-role.enum";
import { DashboardCashierTransactions } from "../pages/cashier/dasboard-cashier-transactions";
import { DashboardClientWallet } from "../pages/client/dasboard-client-wallet";

export const router = createBrowserRouter([
  {
    element: <Animator />,
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoute requireAuth={false}>
            <Navigate to="/dashboard-admin" />
          </ProtectedRoute>
        ),
      },
      {
        path: "/login",
        element: (
          <ProtectedRoute requireAuth={false}>
            <Login />
          </ProtectedRoute>
        ),
      },
      // Admin
      {
        path: "/dashboard-admin",
        element: (
          <ProtectedRoute requireAuth={true}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard-admin/employees",
        element: (
          <ProtectedRoute requireAuth={true} pageRole={UserRole.ADMIN}>
            <AdminDashboardEmployees />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard-admin/clients",
        element: (
          <ProtectedRoute requireAuth={true} pageRole={UserRole.ADMIN}>
            <AdminDashboardClients />
          </ProtectedRoute>
        ),
      },
      // Employee
      {
        path: "/dashboard-employee/clients",
        element: (
          <ProtectedRoute requireAuth={true} pageRole={UserRole.EMPLOYEE}>
            <DashboardEmployeeClients />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard-employee/products",
        element: (
          <ProtectedRoute requireAuth={true} pageRole={UserRole.EMPLOYEE}>
            <DashboardEmployeeProducts />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard-employee/transactions",
        element: (
          <ProtectedRoute requireAuth={true} pageRole={UserRole.EMPLOYEE}>
            <DashboardEmployeeTransactions />
          </ProtectedRoute>
        ),
      },
      // Cashier
      {
        path: "/dashboard-cashier/transactions",
        element: (
          <ProtectedRoute requireAuth={true} pageRole={UserRole.CASHIER}>
            <DashboardCashierTransactions />
          </ProtectedRoute>
        ),
      },
      // Client
      {
        path: "/dashboard-client/wallet",
        element: (
          <ProtectedRoute requireAuth={true} pageRole={UserRole.CLIENT}>
            <DashboardClientWallet />
          </ProtectedRoute>
        ),
      },
    ],
    errorElement: <Error />,
  },
]);
