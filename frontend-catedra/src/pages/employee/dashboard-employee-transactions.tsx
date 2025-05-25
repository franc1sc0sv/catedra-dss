import { TransactionsModule } from "../../components/modules/transactions/transactions.module";
import { EmployeeDashboardTemplate } from "./index-dashboard-employee";

export const DashboardEmployeeTransactions = () => {
  return (
    <EmployeeDashboardTemplate>
      <TransactionsModule />
    </EmployeeDashboardTemplate>
  );
};
