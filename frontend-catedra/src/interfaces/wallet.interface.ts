import type { Client } from "./client.interface";
import type {
  Account,
  Card,
  Loan,
  Insurance,
} from "./financial-products.interface";
import type { TransactionOutput } from "./transaction.interface";

export interface WalletTotals {
  total_balance: number;
  total_credit: number;
  total_debt: number;
  total_insurance: number;
  net_worth: number;
}

export interface WalletProducts {
  accounts: Account[];
  cards: Card[];
  loans: Loan[];
  insurances: Insurance[];
}

export interface WalletOutput {
  client: Client;
  products: WalletProducts;
  recent_transactions: TransactionOutput[];
  totals: WalletTotals;
}

export interface WalletResponse {
  data: WalletOutput;
}

export interface WalletError {
  error: string;
}
