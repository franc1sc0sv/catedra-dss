import axiosClient from "../lib/axios-client";
import type { DashboardSummary } from "../interfaces/admin";

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  const response = await axiosClient.get<DashboardSummary>(
    "/api/admin/dashboard"
  );
  return response.data;
};
