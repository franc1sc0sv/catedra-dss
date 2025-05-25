// Common types
export type ProductStatus = "active" | "closed";
export type CardNetwork = "Visa" | "MasterCard";
export type CardCategory =
  | "Classic"
  | "Infinite"
  | "Gold"
  | "Platinum"
  | "Business";
export type LoanCategory = "personal" | "agricultural" | "mortgage";
export type InsuranceType = "life" | "health" | "assistance";
export type PaymentFrequency =
  | "monthly"
  | "quarterly"
  | "semiannual"
  | "annual";
export type AssistanceType = "roadside" | "home";

// Account interfaces
export interface AccountBeneficiary {
  id: string;
  account_id: string;
  full_name: string;
  relationship: string;
  percentage: number;
  created_at: string;
}

export interface CreateAccountInput {
  client_id: string;
  account_number: string;
  amount: number;
  beneficiaries: {
    full_name: string;
    relationship: string;
    percentage: number;
  }[];
}

export interface Account {
  id: string;
  client_id: string;
  account_number: string;
  opening_date: string;
  amount: number;
  account_status: ProductStatus;
  closing_date: string | null;
  created_at: string;
  beneficiaries: AccountBeneficiary[];
}

// Card interfaces
export interface CreateCardInput {
  client_id: string;
  card_number: string;
  limit_amount: number;
  network: CardNetwork;
  category: CardCategory;
  interest_rate: number;
  membership_fee: number;
}

export interface Card {
  id: string;
  client_id: string;
  card_number: string;
  issue_date: string;
  limit_amount: number;
  closing_date: string | null;
  network: CardNetwork;
  category: CardCategory;
  interest_rate: number;
  card_status: ProductStatus;
  membership_fee: number;
  created_at: string;
}

// Loan interfaces
export interface CreateLoanInput {
  client_id: string;
  reference_number: string;
  loan_amount: number;
  payment_terms: number;
  monthly_payment: number;
  due_date: string;
  interest_rate: number;
  insurance_fee: number;
  beneficiaries: string;
  category: LoanCategory;
}

export interface Loan {
  id: string;
  client_id: string;
  reference_number: string;
  issue_date: string;
  loan_amount: number;
  payment_terms: number;
  monthly_payment: number;
  due_date: string;
  interest_rate: number;
  insurance_fee: number;
  beneficiaries: string;
  category: LoanCategory;
  loan_status: ProductStatus;
  created_at: string;
}

// Insurance interfaces
export interface CreateInsuranceInput {
  client_id: string;
  reference_number: string;
  type: InsuranceType;
  contract_date: string;
  end_date: string;
  payment_frequency: PaymentFrequency;
  fee_amount: number;
  insured_amount: number;
  daily_hospital_rent: number;
  coverage_conditions: string;
  assistance_type: AssistanceType;
}

export interface Insurance {
  id: string;
  client_id: string;
  reference_number: string;
  type: InsuranceType;
  contract_date: string;
  end_date: string;
  payment_frequency: PaymentFrequency;
  fee_amount: number;
  insured_amount: number;
  daily_hospital_rent: number;
  coverage_conditions: string;
  assistance_type: AssistanceType;
  insurance_status: ProductStatus;
  created_at: string;
}

// API Response interfaces
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface CreateAccountResponse extends ApiResponse<Account> {}
export interface ListAccountsResponse extends ApiResponse<Account[]> {}
export interface CreateCardResponse extends ApiResponse<Card> {}
export interface ListCardsResponse extends ApiResponse<Card[]> {}
export interface CreateLoanResponse extends ApiResponse<Loan> {}
export interface ListLoansResponse extends ApiResponse<Loan[]> {}
export interface CreateInsuranceResponse extends ApiResponse<Insurance> {}
export interface ListInsurancesResponse extends ApiResponse<Insurance[]> {}
export interface CloseProductResponse
  extends ApiResponse<{ status: ProductStatus }> {}
