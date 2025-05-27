import type { ReactNode } from "react";
import DashboardLayout from "../../components/layouts/dashboard-layout";
import { FaWallet } from "react-icons/fa";

export const DashboardClientTemplate = ({
  children,
}: {
  children: ReactNode;
}) => {
  const links = [
    {
      label: "Wallet",
      icon: <FaWallet />,
      to: "/dashboard-client/wallet",
    },
  ];
  return (
    <DashboardLayout
      title="Dashboard de cliente"
      subtitle="Ver el estado de tu wallet, transacciones y más"
      links={links}
    >
      {children}
    </DashboardLayout>
  );
};
