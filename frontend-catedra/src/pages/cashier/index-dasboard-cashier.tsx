import type { ReactNode } from "react";
import DashboardLayout from "../../components/layouts/dashboard-layout";
import { FaMoneyBillAlt } from "react-icons/fa";

export const DashboardCashierTemplate = ({
  children,
}: {
  children: ReactNode;
}) => {
  const links = [
    {
      label: "Transacciones",
      icon: <FaMoneyBillAlt />,
      to: "/dashboard-cashier/transactions",
    },
  ];
  return (
    <DashboardLayout
      title="Dashboard de cajero"
      subtitle="Gestiona las transacciones y los clientes"
      links={links}
    >
      {children}
    </DashboardLayout>
  );
};
