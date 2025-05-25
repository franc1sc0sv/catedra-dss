export interface User {
  id: string;
  username: string;
  password_hash: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserResponse {
  success: boolean;
  user: User;
}
