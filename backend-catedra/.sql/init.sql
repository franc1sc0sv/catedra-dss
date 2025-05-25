-- ENUMS
CREATE TYPE user_role AS ENUM ('admin', 'employee', 'cashier', 'client');
CREATE TYPE product_status AS ENUM ('active', 'closed');
CREATE TYPE card_network AS ENUM ('Visa', 'MasterCard');
CREATE TYPE card_category AS ENUM ('Classic', 'Infinite', 'Gold', 'Platinum', 'Business');
CREATE TYPE loan_category AS ENUM ('personal', 'agricultural', 'mortgage');
CREATE TYPE insurance_type AS ENUM ('life', 'health', 'assistance');
CREATE TYPE payment_frequency AS ENUM ('monthly', 'quarterly', 'semiannual', 'annual');
CREATE TYPE assistance_type AS ENUM ('roadside', 'home');
CREATE TYPE transaction_reference_type AS ENUM ('account', 'card', 'loan', 'insurance');
CREATE TYPE transaction_type AS ENUM ('deposit', 'withdrawal', 'transfer', 'payment', 'fee', 'interest', 'penalty', 'adjustment');

-- USERS
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role user_role NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- EMPLOYEES
CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id),
    code VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    marital_status VARCHAR(20) NOT NULL,
    identity_document VARCHAR(20) UNIQUE NOT NULL,
    birth_date DATE NOT NULL,
    age INT NOT NULL,
    address_street VARCHAR(100),
    address_house VARCHAR(20),
    address_city VARCHAR(50),
    address_state VARCHAR(50),
    position VARCHAR(50) NOT NULL,
    department VARCHAR(50) NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    profession VARCHAR(100),
    emails TEXT,
    phones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CLIENTS
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id),
    full_name VARCHAR(150) NOT NULL,
    identity_document VARCHAR(20) UNIQUE NOT NULL,
    birth_date DATE NOT NULL,
    age INT NOT NULL,
    marital_status VARCHAR(20) NOT NULL,
    profession VARCHAR(100),
    emails TEXT,
    phones TEXT,
    address_street VARCHAR(100),
    address_house VARCHAR(20),
    address_city VARCHAR(50),
    address_state VARCHAR(50),
    workplace VARCHAR(100),
    workplace_address VARCHAR(150),
    monthly_income DECIMAL(10,2),
    additional_income DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ACCOUNTS
CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id),
    account_number VARCHAR(20) UNIQUE NOT NULL,
    opening_date DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    amount DECIMAL(12,2) NOT NULL,
    account_status product_status NOT NULL DEFAULT 'active',
    closing_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

-- ACCOUNT BENEFICIARIES (intermediate table)
CREATE TABLE account_beneficiaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
    full_name VARCHAR(150) NOT NULL,
    relationship VARCHAR(50),
    percentage DECIMAL(5,2) CHECK (percentage >= 0 AND percentage <= 100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CARDS
CREATE TABLE cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id),
    card_number VARCHAR(20) UNIQUE NOT NULL,
    issue_date DATE NOT NULL,
    limit_amount DECIMAL(12,2) NOT NULL,
    closing_date DATE,
    network card_network NOT NULL,
    category card_category NOT NULL,
    interest_rate DECIMAL(5,2) NOT NULL,
    card_status product_status NOT NULL DEFAULT 'active',
    membership_fee DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- LOANS
CREATE TABLE loans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id),
    reference_number VARCHAR(30) UNIQUE NOT NULL,
    issue_date DATE NOT NULL,
    loan_amount DECIMAL(12,2) NOT NULL,
    payment_terms INT,
    monthly_payment DECIMAL(12,2) NOT NULL,
    due_date DATE NOT NULL,
    interest_rate DECIMAL(5,2) NOT NULL,
    insurance_fee DECIMAL(10,2),
    beneficiaries TEXT,
    category loan_category NOT NULL,
    loan_status product_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- INSURANCES
CREATE TABLE insurances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id),
    reference_number VARCHAR(30) UNIQUE NOT NULL,
    type insurance_type NOT NULL,
    contract_date DATE NOT NULL,
    end_date DATE NOT NULL,
    payment_frequency payment_frequency NOT NULL,
    fee_amount DECIMAL(10,2) NOT NULL,
    insured_amount DECIMAL(12,2),
    daily_hospital_rent DECIMAL(10,2),
    coverage_conditions TEXT,
    assistance_type assistance_type,
    insurance_status product_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TRANSACTIONS
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_number VARCHAR(30) UNIQUE NOT NULL,
    reference_id UUID NOT NULL, -- if is account, card, loan, insurance
    reference_type transaction_reference_type NOT NULL,
    client_id UUID REFERENCES clients(id),
    description VARCHAR(100),
    created_by UUID REFERENCES employees(id),
    amount DECIMAL(12,2) NOT NULL,
    transaction_type transaction_type NOT NULL,
    transaction_code VARCHAR(20) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
