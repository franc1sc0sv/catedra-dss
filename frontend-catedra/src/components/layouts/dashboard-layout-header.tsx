import { useAuth } from "../../hooks/use-auth";

interface DashboardLayoutHeaderProps {
  title: string;
  subtitle?: string;
}

const DashboardLayoutHeader = ({
  title,
  subtitle,
}: DashboardLayoutHeaderProps) => {
  const { user } = useAuth();

  return (
    <header className="flex items-center justify-between px-8 py-6 bg-white border-b border-gray-200">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {user && (
        <div className="flex items-center space-x-3">
          <span className="text-gray-700">Bienvenido, {user.username}</span>
          <span className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold text-lg">
            {user.username ? user.username.charAt(0).toUpperCase() : "A"}
          </span>
        </div>
      )}
    </header>
  );
};

export default DashboardLayoutHeader;
