import axiosClient from "../lib/axios-client";
import type {
  CreateEmployeeInput,
  CreateEmployeeResponse,
  ListEmployeesResponse,
  GetEmployeeResponse,
  ToggleEmployeeStatusResponse,
} from "../interfaces/employee";

export const createEmployee = async (
  data: CreateEmployeeInput
): Promise<CreateEmployeeResponse> => {
  const response = await axiosClient.post<CreateEmployeeResponse>(
    "/api/employees",
    data
  );
  return response.data;
};

export const getEmployees = async (): Promise<ListEmployeesResponse> => {
  const response = await axiosClient.get<ListEmployeesResponse>(
    "/api/employees"
  );
  return response.data;
};

export const getEmployeeById = async (
  id: string
): Promise<GetEmployeeResponse> => {
  const response = await axiosClient.get<GetEmployeeResponse>(
    `/api/employees/${id}`
  );
  return response.data;
};

export const toggleEmployeeStatus = async (
  id: string
): Promise<ToggleEmployeeStatusResponse> => {
  const response = await axiosClient.put<ToggleEmployeeStatusResponse>(
    `/api/employees/${id}/toggle-status`
  );
  return response.data;
};
