import axiosClient from "../lib/axios-client";
import type {
  CreateClientInput,
  CreateClientResponse,
  ListClientsResponse,
  ToggleClientStatusResponse,
} from "../interfaces/client.interface";

export const createClient = async (
  data: CreateClientInput
): Promise<CreateClientResponse> => {
  const response = await axiosClient.post<CreateClientResponse>(
    "/api/clients",
    data
  );
  return response.data;
};

export const getClients = async (): Promise<ListClientsResponse> => {
  const response = await axiosClient.get<ListClientsResponse>("/api/clients");
  return response.data;
};

export const getClientById = async (
  id: string
): Promise<ListClientsResponse> => {
  const response = await axiosClient.get<ListClientsResponse>(
    `/api/clients/${id}`
  );
  return response.data;
};

export const toggleClientStatus = async (
  id: string
): Promise<ToggleClientStatusResponse> => {
  const response = await axiosClient.put<ToggleClientStatusResponse>(
    `/api/clients/${id}/toggle-status`
  );
  return response.data;
};
