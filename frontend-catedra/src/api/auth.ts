import axiosClient from "../lib/axios-client";
import type { LoginResponse } from "../interfaces/auth.interface";
import type { UserResponse } from "../interfaces/user.interface";

export const authApi = {
  me: async (): Promise<UserResponse> => {
    const { data } = await axiosClient.get("/api/profile");
    return data;
  },

  login: async (username: string, password: string): Promise<LoginResponse> => {
    const { data } = await axiosClient.post("/api/login", {
      username,
      password,
    });
    return data;
  },
};
