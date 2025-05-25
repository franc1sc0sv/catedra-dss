import { TransactionsModule } from "../../components/modules/transactions/transactions.module";
import { DashboardCashierTemplate } from "./index-dasboard-cashier";

export const DashboardCashierTransactions = () => {
  return (
    <DashboardCashierTemplate>
      <TransactionsModule />
    </DashboardCashierTemplate>
  );
};
