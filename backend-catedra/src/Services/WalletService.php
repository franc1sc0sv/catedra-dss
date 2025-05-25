<?php

namespace App\Services;

use PDO;
use Exception;

class WalletService
{
    private $db;
    private $clientService;
    private $accountService;
    private $cardService;
    private $loanService;
    private $insuranceService;
    private $transactionService;

    public function __construct(PDO $db)
    {
        $this->db = $db;
        $this->clientService = new ClientService($db);
        $this->accountService = new AccountService($db);
        $this->cardService = new CardService($db);
        $this->loanService = new LoanService($db);
        $this->insuranceService = new InsuranceService($db);
        $this->transactionService = new TransactionService($db);
    }

    public function getWalletData(string $clientId): array
    {
        try {
            // Obtener datos del cliente
            $client = $this->clientService->getById($clientId);
            if (!$client) {
                throw new Exception("Cliente no encontrado");
            }

            // Obtener cuentas
            $accounts = $this->getClientAccounts($clientId);

            // Obtener tarjetas
            $cards = $this->getClientCards($clientId);

            // Obtener préstamos
            $loans = $this->getClientLoans($clientId);

            // Obtener seguros
            $insurances = $this->getClientInsurances($clientId);

            // Obtener transacciones recientes
            $recentTransactions = $this->getRecentTransactions($clientId);

            // Calcular totales
            $totals = $this->calculateTotals($accounts, $cards, $loans, $insurances);

            return [
                'client' => $client,
                'products' => [
                    'accounts' => $accounts,
                    'cards' => $cards,
                    'loans' => $loans,
                    'insurances' => $insurances
                ],
                'recent_transactions' => $recentTransactions,
                'totals' => $totals
            ];
        } catch (Exception $e) {
            throw new Exception("Error al obtener datos del wallet: " . $e->getMessage());
        }
    }

    private function getClientAccounts(string $clientId): array
    {
        $stmt = $this->db->prepare("
            SELECT a.*, 
                   COALESCE(SUM(CASE 
                       WHEN t.transaction_type = 'deposit' THEN t.amount 
                       WHEN t.transaction_type = 'withdrawal' THEN -t.amount 
                       ELSE 0 
                   END), 0) as current_balance
            FROM accounts a
            LEFT JOIN transactions t ON a.id = t.reference_id AND t.reference_type = 'account'
            WHERE a.client_id = ? AND a.account_status = 'active'
            GROUP BY a.id
            ORDER BY a.created_at DESC
        ");
        $stmt->execute([$clientId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    private function getClientCards(string $clientId): array
    {
        $stmt = $this->db->prepare("
            SELECT c.*, 
                   COALESCE(SUM(CASE 
                       WHEN t.transaction_type = 'payment' THEN -t.amount 
                       ELSE 0 
                   END), 0) as current_balance
            FROM cards c
            LEFT JOIN transactions t ON c.id = t.reference_id AND t.reference_type = 'card'
            WHERE c.client_id = ? AND c.card_status = 'active'
            GROUP BY c.id
            ORDER BY c.created_at DESC
        ");
        $stmt->execute([$clientId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    private function getClientLoans(string $clientId): array
    {
        $stmt = $this->db->prepare("
            SELECT l.*, 
                   COALESCE(SUM(CASE 
                       WHEN t.transaction_type = 'payment' THEN -t.amount 
                       ELSE 0 
                   END), 0) as paid_amount,
                   (l.loan_amount - COALESCE(SUM(CASE 
                       WHEN t.transaction_type = 'payment' THEN -t.amount 
                       ELSE 0 
                   END), 0)) as remaining_balance
            FROM loans l
            LEFT JOIN transactions t ON l.id = t.reference_id AND t.reference_type = 'loan'
            WHERE l.client_id = ? AND l.loan_status = 'active'
            GROUP BY l.id
            ORDER BY l.created_at DESC
        ");
        $stmt->execute([$clientId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    private function getClientInsurances(string $clientId): array
    {
        $stmt = $this->db->prepare("
            SELECT i.*, 
                   COALESCE(SUM(CASE 
                       WHEN t.transaction_type = 'payment' THEN -t.amount 
                       ELSE 0 
                   END), 0) as paid_amount
            FROM insurances i
            LEFT JOIN transactions t ON i.id = t.reference_id AND t.reference_type = 'insurance'
            WHERE i.client_id = ? AND i.insurance_status = 'active'
            GROUP BY i.id
            ORDER BY i.created_at DESC
        ");
        $stmt->execute([$clientId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    private function getRecentTransactions(string $clientId): array
    {
        $stmt = $this->db->prepare("
            SELECT t.*,
                   CASE 
                       WHEN t.reference_type = 'account' THEN a.account_number
                       WHEN t.reference_type = 'card' THEN c.card_number
                       WHEN t.reference_type = 'loan' THEN l.reference_number
                       WHEN t.reference_type = 'insurance' THEN i.reference_number
                   END as product_reference
            FROM transactions t
            LEFT JOIN accounts a ON t.reference_id = a.id AND t.reference_type = 'account'
            LEFT JOIN cards c ON t.reference_id = c.id AND t.reference_type = 'card'
            LEFT JOIN loans l ON t.reference_id = l.id AND t.reference_type = 'loan'
            LEFT JOIN insurances i ON t.reference_id = i.id AND t.reference_type = 'insurance'
            WHERE t.client_id = ?
            ORDER BY t.created_at DESC
            LIMIT 10
        ");
        $stmt->execute([$clientId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    private function calculateTotals(array $accounts, array $cards, array $loans, array $insurances): array
    {
        $totalBalance = 0;
        $totalCredit = 0;
        $totalDebt = 0;
        $totalInsurance = 0;

        // Calcular balance total de cuentas
        foreach ($accounts as $account) {
            $totalBalance += $account['current_balance'];
        }

        // Calcular crédito disponible en tarjetas
        foreach ($cards as $card) {
            $availableCredit = $card['limit_amount'] - $card['current_balance'];
            $totalCredit += $availableCredit;
        }

        // Calcular deuda total de préstamos
        foreach ($loans as $loan) {
            $totalDebt += $loan['remaining_balance'];
        }

        // Calcular total de seguros activos
        foreach ($insurances as $insurance) {
            $totalInsurance += $insurance['fee_amount'];
        }

        return [
            'total_balance' => $totalBalance,
            'total_credit' => $totalCredit,
            'total_debt' => $totalDebt,
            'total_insurance' => $totalInsurance,
            'net_worth' => $totalBalance + $totalCredit - $totalDebt - $totalInsurance
        ];
    }
}
