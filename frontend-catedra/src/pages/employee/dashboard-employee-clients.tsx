import { ClientsModule } from "../../components/modules/clients/clients.module";
import { EmployeeDashboardTemplate } from "./index-dashboard-employee";

export const DashboardEmployeeClients = () => {
  return (
    <EmployeeDashboardTemplate>
      <ClientsModule />
    </EmployeeDashboardTemplate>
  );
};
