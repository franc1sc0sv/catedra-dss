import { ProductsModule } from "../../components/modules/products/products.module";
import { EmployeeDashboardTemplate } from "./index-dashboard-employee";

export const DashboardEmployeeProducts = () => {
  return (
    <EmployeeDashboardTemplate>
      <ProductsModule />
    </EmployeeDashboardTemplate>
  );
};
