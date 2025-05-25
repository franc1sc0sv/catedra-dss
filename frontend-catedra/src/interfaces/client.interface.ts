export interface CreateClientInput {
  username: string;
  password: string;
  full_name: string;
  marital_status: "single" | "married" | "divorced" | "widowed";
  identity_document: string;
  birth_date: string;
  age: number;
  occupation: string;
  monthly_income: number;
  emails: string[];
  phones: string[];
}

export interface Client {
  id: string;
  user_id: string;
  full_name: string;
  marital_status: "single" | "married" | "divorced" | "widowed";
  identity_document: string;
  birth_date: string;
  age: number;
  occupation: string;
  monthly_income: number;
  emails: string[];
  phones: string[];
  is_active: boolean;
  username: string;
  created_at: string;
  user_created_at: string;
  user_updated_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface CreateClientResponse extends ApiResponse<Client> {}
export interface ListClientsResponse extends ApiResponse<Client[]> {}
export interface GetClientResponse extends ApiResponse<Client> {}
export interface ToggleClientStatusResponse
  extends ApiResponse<{ is_active: boolean }> {}
