import type { ApiResponse } from "./api-response.interface";

// Employee Interfaces
export interface CreateEmployeeInput {
  username: string;
  password: string;
  code: string;
  full_name: string;
  marital_status: string;
  identity_document: string;
  birth_date: string;
  age: number;
  address_street?: string;
  address_house?: string;
  address_city?: string;
  address_state?: string;
  position: string;
  department: string;
  salary: number;
  profession?: string;
  emails?: string;
  phones?: string;
}

export interface Employee {
  id: string;
  user_id: string;
  code: string;
  full_name: string;
  marital_status: string;
  identity_document: string;
  birth_date: string;
  age: number;
  address_street?: string;
  address_house?: string;
  address_city?: string;
  address_state?: string;
  position: string;
  department: string;
  salary: number;
  profession?: string;
  emails?: string;
  phones?: string;
  is_active: boolean;
  username: string;
  created_at: string;
  user_created_at: string;
  user_updated_at: string;
}

// Employee Response Interfaces
export interface CreateEmployeeResponse
  extends ApiResponse<{
    id: string;
    user_id: string;
    code: string;
    full_name: string;
  }> {}

export interface ListEmployeesResponse extends ApiResponse<Employee[]> {}

export interface GetEmployeeResponse extends ApiResponse<Employee> {}

export interface ToggleEmployeeStatusResponse
  extends ApiResponse<{
    is_active: boolean;
  }> {}
