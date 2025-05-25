import { BiSolidUser } from "react-icons/bi";
import DashboardLayout from "../../components/layouts/dashboard-layout";
import { FaMoneyBillAlt } from "react-icons/fa";
import { AiOutlineProduct } from "react-icons/ai";

export const EmployeeDashboardTemplate = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const links = [
    {
      label: "Clientes",
      icon: <BiSolidUser />,
      to: "/dashboard-employee/clients",
    },
    {
      label: "Productos",
      icon: <AiOutlineProduct />,
      to: "/dashboard-employee/products",
    },
    {
      label: "Transacciones",
      icon: <FaMoneyBillAlt />,
      to: "/dashboard-employee/transactions",
    },
  ];
  return (
    <DashboardLayout
      title="Dashboard"
      subtitle="Bienvenido al dashboard de empleado"
      links={links}
    >
      {children}
    </DashboardLayout>
  );
};
