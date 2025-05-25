import { BiSolidDashboard, BiSolidUser } from "react-icons/bi";
import DashboardLayout from "../../components/layouts/dashboard-layout";
import { MdWork } from "react-icons/md";

export const AdminDashboardTemplate = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const links = [
    {
      label: "Dashboard",
      icon: <BiSolidDashboard />,
      to: "/dashboard-admin",
    },
    {
      label: "Empleados",
      icon: <MdWork />,
      to: "/dashboard-admin/employees",
    },
    {
      label: "Clientes",
      icon: <BiSolidUser />,
      to: "/dashboard-admin/clients",
    },
  ];
  return (
    <DashboardLayout
      title="Dashboard"
      subtitle="Bienvenido al dashboard de administración"
      links={links}
    >
      {children}
    </DashboardLayout>
  );
};
