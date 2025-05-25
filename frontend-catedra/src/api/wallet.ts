import axiosClient from "../lib/axios-client";
import type { WalletResponse } from "../interfaces/wallet.interface";

export const getWalletData = async (): Promise<WalletResponse> => {
  const response = await axiosClient.get<WalletResponse>("/api/wallet");
  return response.data;
};
