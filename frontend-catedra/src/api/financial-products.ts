import axiosClient from "../lib/axios-client";
import type {
  CreateAccountInput,
  CreateCardInput,
  CreateLoanInput,
  CreateInsuranceInput,
  ListAccountsResponse,
  ListCardsResponse,
  ListLoansResponse,
  ListInsurancesResponse,
  CreateAccountResponse,  
  CreateCardResponse,  
  CreateLoanResponse,
  CreateInsuranceResponse,
} from "../interfaces/financial-products.interface";

// Accounts
export const createAccount = async (
  data: CreateAccountInput
): Promise<CreateAccountResponse> => {
  const response = await axiosClient.post<CreateAccountResponse>(
    "/api/accounts",
    data
  );
  return response.data;
};

export const getAccounts = async (): Promise<ListAccountsResponse> => {
  const response = await axiosClient.get<ListAccountsResponse>("/api/accounts");
  return response.data;
};

export const getAccountById = async (
  id: string
): Promise<ListAccountsResponse> => {
  const response = await axiosClient.get<ListAccountsResponse>(
    `/api/accounts/${id}`
  );
  return response.data;
};

export const closeAccount = async (
  id: string
): Promise<{ account_status: string }> => {
  const response = await axiosClient.put<{ account_status: string }>(
    `/api/accounts/${id}/close`
  );
  return response.data;
};

// Cards
export const createCard = async (
  data: CreateCardInput
): Promise<CreateCardResponse> => {
  const response = await axiosClient.post<CreateCardResponse>(
    "/api/cards",
    data
  );
  return response.data;
};

export const getCards = async (): Promise<ListCardsResponse> => {
  const response = await axiosClient.get<ListCardsResponse>("/api/cards");
  return response.data;
};

export const getCardById = async (id: string): Promise<ListCardsResponse> => {
  const response = await axiosClient.get<ListCardsResponse>(`/api/cards/${id}`);
  return response.data;
};

export const closeCard = async (
  id: string
): Promise<{ card_status: string }> => {
  const response = await axiosClient.put<{ card_status: string }>(
    `/api/cards/${id}/close`
  );
  return response.data;
};

// Loans
export const createLoan = async (
  data: CreateLoanInput
): Promise<CreateLoanResponse> => {
  const response = await axiosClient.post<CreateLoanResponse>(
    "/api/loans",
    data
  );
  return response.data;
};

export const getLoans = async (): Promise<ListLoansResponse> => {
  const response = await axiosClient.get<ListLoansResponse>("/api/loans");
  return response.data;
};

export const getLoanById = async (id: string): Promise<ListLoansResponse> => {
  const response = await axiosClient.get<ListLoansResponse>(`/api/loans/${id}`);
  return response.data;
};

export const closeLoan = async (
  id: string
): Promise<{ loan_status: string }> => {
  const response = await axiosClient.put<{ loan_status: string }>(
    `/api/loans/${id}/close`
  );
  return response.data;
};

// Insurances
export const createInsurance = async (
  data: CreateInsuranceInput
): Promise<CreateInsuranceResponse> => {
  const response = await axiosClient.post<CreateInsuranceResponse>(
    "/api/insurances",
    data
  );
  return response.data;
};

export const getInsurances = async (): Promise<ListInsurancesResponse> => {
  const response = await axiosClient.get<ListInsurancesResponse>(
    "/api/insurances"
  );
  return response.data;
};

export const getInsuranceById = async (
  id: string
): Promise<ListInsurancesResponse> => {
  const response = await axiosClient.get<ListInsurancesResponse>(
    `/api/insurances/${id}`
  );
  return response.data;
};

export const closeInsurance = async (
  id: string
): Promise<{ insurance_status: string }> => {
  const response = await axiosClient.put<{ insurance_status: string }>(
    `/api/insurances/${id}/close`
  );
  return response.data;
};
