import { ClientsModule } from "../../components/modules/clients/clients.module";
import { AdminDashboardTemplate } from "./index-admin-dashboard";

export const AdminDashboardClients = () => {
  return (
    <AdminDashboardTemplate>
      <ClientsModule />
    </AdminDashboardTemplate>
  );
};
