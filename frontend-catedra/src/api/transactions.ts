import axiosClient from "../lib/axios-client";
import type {
  TransactionInput,
  TransactionResponse,
  TransactionListResponse,
} from "../interfaces/transaction.interface";

export const createTransaction = async (
  data: TransactionInput
): Promise<TransactionResponse> => {
  const response = await axiosClient.post<TransactionResponse>(
    "/api/transactions",
    data
  );
  return response.data;
};

export const getTransactionsByClient = async (
  clientId: string
): Promise<TransactionListResponse> => {
  const response = await axiosClient.get<TransactionListResponse>(
    `/api/transactions/client/${clientId}`
  );
  return response.data;
};

export const getTransactionsByProduct = async (
  referenceType: string,
  referenceId: string
): Promise<TransactionListResponse> => {
  const response = await axiosClient.get<TransactionListResponse>(
    `/api/transactions/product/${referenceType}/${referenceId}`
  );
  return response.data;
};
