import axiosClient from "../lib/axios-client";
import type {
  LoginInput,
  LoginResponse,
  ProfileResponse,
} from "../interfaces/auth.interface";

export const loginAxios = async (data: LoginInput): Promise<LoginResponse> => {
  const response = await axiosClient.post<LoginResponse>(
    "/api/auth/login",
    data
  );
  return response.data;
};

export const getProfile = async (): Promise<ProfileResponse> => {
  const response = await axiosClient.get<ProfileResponse>("/api/auth/profile");
  return response.data;
};
