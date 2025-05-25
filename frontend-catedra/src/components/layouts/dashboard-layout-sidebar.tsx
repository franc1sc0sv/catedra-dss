import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/use-auth";

interface DashboardLayoutSidebarProps {
  links: {
    label: string;
    icon?: React.ReactNode;
    to: string;
  }[];
}

const DashboardLayoutSidebar = ({ links }: DashboardLayoutSidebarProps) => {
  const { logout } = useAuth();

  return (
    <aside className="w-64 bg-[#1a2236] flex flex-col justify-between min-h-screen py-6">
      <div className="flex flex-col items-center mb-10">
        <div className="flex items-center mb-10 ">
          <span className="text-white text-xl font-bold tracking-wide">
            ACOEMPRENDEDORES
          </span>
        </div>
        <nav className="w-full flex flex-col items-center justify-start">
          <ul className="space-y-2 w-full flex flex-col gap-10">
            {links.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="flex items-center justify-start px-4 py-2 rounded-lg text-white hover:bg-[#27304a] transition-colors"
                >
                  {link.icon && <span className="mr-3">{link.icon}</span>}
                  <span>{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <button
        className="flex items-center px-4 py-2 mt-8 rounded-lg text-red-400 hover:bg-[#2c2f3a] transition-colors"
        onClick={logout}
      >
        <span className="mr-2">⏻</span>
        Logout
      </button>
    </aside>
  );
};

export default DashboardLayoutSidebar;
