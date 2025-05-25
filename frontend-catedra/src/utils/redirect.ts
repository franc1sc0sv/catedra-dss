import { UserRole } from "../enums/user-role.enum";

export const redirectInBaseOfRole = ({ role }: { role: string }) => {
  const routes: {
    [key in UserRole]: string;
  } = {
    [UserRole.ADMIN]: "/dashboard-admin",
    [UserRole.EMPLOYEE]: "/dashboard-employee/clients",
    [UserRole.CASHIER]: "/dashboard-cashier/transactions",
    [UserRole.CLIENT]: "/dashboard-client/wallet",
  };

  return routes[role as UserRole];
};
