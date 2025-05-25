import { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/use-auth";
import { UserRole } from "../../enums/user-role.enum";
import { redirectInBaseOfRole } from "../../utils/redirect";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  pageRole?: UserRole;
}

export const ProtectedRoute = ({
  children,
  requireAuth = true,
  pageRole,
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAuth && isAuthenticated) {
    const userRole = user?.role as UserRole;

    if (pageRole && userRole !== pageRole) {
      const redirectRoute = redirectInBaseOfRole({ role: userRole });
      return <Navigate to={redirectRoute} replace />;
    }
  }

  return <>{children}</>;
};
