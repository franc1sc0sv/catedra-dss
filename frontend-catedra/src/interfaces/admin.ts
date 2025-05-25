import type { ApiResponse } from "./api-response.interface";

// Dashboard Summary Interfaces
export interface DashboardSummary {
  summary: {
    employees: number;
    clients: number;
    products: number;
    transactions: number;
  };
  latest_transactions: Transaction[];
  product_distribution: {
    accounts: number;
    cards: number;
    loans: number;
    insurances: number;
  };
}

export interface Transaction {
  id: string;
  reference_number: string;
  reference_id: string;
  reference_type: "account" | "card" | "loan" | "insurance";
  client_id: string;
  client_name: string;
  employee_name: string;
  description: string;
  created_by: string;
  amount: number;
  transaction_type:
    | "deposit"
    | "withdrawal"
    | "transfer"
    | "payment"
    | "fee"
    | "interest"
    | "penalty"
    | "adjustment";
  transaction_code: string;
  created_at: string;
}

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

// Dashboard Response
export interface DashboardResponse extends ApiResponse<DashboardSummary> {}

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
