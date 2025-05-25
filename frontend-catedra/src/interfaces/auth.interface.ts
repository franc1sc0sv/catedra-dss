import type { User } from "./user.interface";

export interface LoginInput {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface ProfileResponse {
  success: boolean;
  data: User;
}
