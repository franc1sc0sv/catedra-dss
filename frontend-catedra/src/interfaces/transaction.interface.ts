export type TransactionReferenceType =
  | "account"
  | "card"
  | "loan"
  | "insurance";
export type TransactionType =
  | "deposit"
  | "withdrawal"
  | "transfer"
  | "payment"
  | "fee"
  | "interest"
  | "penalty"
  | "adjustment";

export interface TransactionInput {
  reference_id: string;
  reference_type: TransactionReferenceType;
  client_id: string;
  description: string;
  amount: number;
  transaction_type: TransactionType;
}

export interface TransactionOutput {
  id: string;
  reference_number: string;
  reference_id: string;
  reference_type: TransactionReferenceType;
  client_id: string;
  description: string;
  created_by: string;
  amount: number;
  transaction_type: TransactionType;
  transaction_code: string;
  created_at: string;
  product_reference?: string; // Número de cuenta, tarjeta, préstamo o seguro
}

export interface TransactionResponse {
  data: TransactionOutput;
}

export interface TransactionListResponse {
  data: TransactionOutput[];
}

export interface TransactionError {
  error: string;
}
