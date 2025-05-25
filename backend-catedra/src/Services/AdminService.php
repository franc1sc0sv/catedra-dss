<?php

namespace App\Services;

use App\Utils\Logger;
use PDO;
use Respect\Validation\Validator as v;

class AdminService
{
    public function __construct(private PDO $pdo) {}

    public function getDashboardSummary(): array
    {
        try {
            // Get counts
            $employeeCount = $this->pdo->query("SELECT COUNT(*) FROM employees")->fetchColumn();
            $clientCount = $this->pdo->query("SELECT COUNT(*) FROM clients")->fetchColumn();

            // Get product counts
            $accountCount = $this->pdo->query("SELECT COUNT(*) FROM accounts")->fetchColumn();
            $cardCount = $this->pdo->query("SELECT COUNT(*) FROM cards")->fetchColumn();
            $loanCount = $this->pdo->query("SELECT COUNT(*) FROM loans")->fetchColumn();
            $insuranceCount = $this->pdo->query("SELECT COUNT(*) FROM insurances")->fetchColumn();

            // Get transaction count
            $transactionCount = $this->pdo->query("SELECT COUNT(*) FROM transactions")->fetchColumn();

            // Get latest transactions with more details
            $latestTransactions = $this->pdo->query(
                "SELECT 
                    t.*,
                    c.full_name as client_name,
                    e.full_name as employee_name
                FROM transactions t 
                JOIN clients c ON t.client_id = c.id 
                LEFT JOIN employees e ON t.created_by = e.id
                ORDER BY t.created_at DESC 
                LIMIT 4"
            )->fetchAll();

            // Get product distribution for chart
            $productDistribution = [
                'accounts' => $accountCount,
                'cards' => $cardCount,
                'loans' => $loanCount,
                'insurances' => $insuranceCount
            ];

            return [
                'summary' => [
                    'employees' => $employeeCount,
                    'clients' => $clientCount,
                    'products' => $accountCount + $cardCount + $loanCount + $insuranceCount,
                    'transactions' => $transactionCount
                ],
                'latest_transactions' => $latestTransactions,
                'product_distribution' => $productDistribution
            ];
        } catch (\Throwable $e) {
            Logger::error("Error getting dashboard summary: " . $e->getMessage());
            throw new \RuntimeException("Error getting dashboard summary");
        }
    }

    public function createEmployee(array $data): array
    {
        try {
            $this->pdo->beginTransaction();

            // Validate employee data
            $validator = v::key('username', v::stringType()->notEmpty())
                ->key('password', v::stringType()->notEmpty())
                ->key('code', v::stringType()->notEmpty())
                ->key('full_name', v::stringType()->notEmpty())
                ->key('marital_status', v::stringType()->notEmpty())
                ->key('identity_document', v::stringType()->notEmpty())
                ->key('birth_date', v::stringType()->notEmpty())
                ->key('age', v::intType()->positive())
                ->key('position', v::stringType()->notEmpty())
                ->key('department', v::stringType()->notEmpty())
                ->key('salary', v::numeric()->positive());

            if (!$validator->validate($data)) {
                throw new \RuntimeException("Invalid employee data");
            }

            // Create user first
            $stmt = $this->pdo->prepare(
                "INSERT INTO users (username, password_hash, role) 
                VALUES (?, ?, 'employee') 
                RETURNING id"
            );
            $stmt->execute([
                $data['username'],
                password_hash($data['password'], PASSWORD_DEFAULT)
            ]);
            $userId = $stmt->fetchColumn();

            // Create employee
            $stmt = $this->pdo->prepare(
                "INSERT INTO employees (
                    user_id, code, full_name, marital_status, identity_document,
                    birth_date, age, address_street, address_house, address_city,
                    address_state, position, department, salary, profession,
                    emails, phones
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                RETURNING id"
            );
            $stmt->execute([
                $userId,
                $data['code'],
                $data['full_name'],
                $data['marital_status'],
                $data['identity_document'],
                $data['birth_date'],
                $data['age'],
                $data['address_street'] ?? null,
                $data['address_house'] ?? null,
                $data['address_city'] ?? null,
                $data['address_state'] ?? null,
                $data['position'],
                $data['department'],
                $data['salary'],
                $data['profession'] ?? null,
                $data['emails'] ?? null,
                $data['phones'] ?? null
            ]);
            $employeeId = $stmt->fetchColumn();

            $this->pdo->commit();

            return [
                'id' => $employeeId,
                'user_id' => $userId,
                'code' => $data['code'],
                'full_name' => $data['full_name']
            ];
        } catch (\Throwable $e) {
            $this->pdo->rollBack();
            Logger::error("Error creating employee: " . $e->getMessage());
            throw new \RuntimeException("Error creating employee");
        }
    }

    public function listEmployees(): array
    {
        try {
            $stmt = $this->pdo->query(
                "SELECT e.*, u.is_active 
                FROM employees e 
                JOIN users u ON e.user_id = u.id 
                ORDER BY e.created_at DESC"
            );
            return $stmt->fetchAll();
        } catch (\Throwable $e) {
            Logger::error("Error listing employees: " . $e->getMessage());
            throw new \RuntimeException("Error listing employees");
        }
    }

    public function toggleEmployeeStatus(string $userId): bool
    {
        try {
            $stmt = $this->pdo->prepare(
                "UPDATE users 
                SET is_active = NOT is_active 
                WHERE id = ? AND role = 'employee' 
                RETURNING is_active"
            );
            $stmt->execute([$userId]);
            return (bool) $stmt->fetchColumn();
        } catch (\Throwable $e) {
            Logger::error("Error toggling employee status: " . $e->getMessage());
            throw new \RuntimeException("Error toggling employee status");
        }
    }
}
