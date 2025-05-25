import { EmployeesModule } from "../../components/modules/employees/employees.module";
import { AdminDashboardTemplate } from "./index-admin-dashboard";

export const AdminDashboardEmployees = () => {
  return (
    <AdminDashboardTemplate>
      <EmployeesModule />
    </AdminDashboardTemplate>
  );
};
