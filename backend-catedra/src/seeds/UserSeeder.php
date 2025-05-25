<?php

namespace App\Seeds;

use App\Services\DatabaseService;
use PDO;

class UserSeeder
{
    private PDO $pdo;

    public function __construct(DatabaseService $db)
    {
        $this->pdo = $db->getConnection();
    }

    public function seed(): void
    {
        if ($this->hasExistingUsers()) {
            echo "Users already exist in the database. Skipping seeding.\n";
            return;
        }

        $this->seedAdmin();
        $this->seedEmployees();
        $this->seedClients();
    }

    private function hasExistingUsers(): bool
    {
        $sql = "SELECT COUNT(*) FROM users";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        return (int)$stmt->fetchColumn() > 0;
    }

    private function isUsernameTaken(string $username): bool
    {
        $sql = "SELECT COUNT(*) FROM users WHERE username = ?";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$username]);
        return (int)$stmt->fetchColumn() > 0;
    }

    private function insertUser(string $username, string $password, string $role): ?string
    {
        if ($this->isUsernameTaken($username)) {
            return null;
        }

        $sql = "INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?) RETURNING id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            $username,
            password_hash($password, PASSWORD_DEFAULT),
            $role
        ]);
        $result = $stmt->fetchColumn();
        return $result === false ? null : $result;
    }

    private function seedAdmin(): void
    {
        $userId = $this->insertUser('admin', 'admin123', 'admin');
        if ($userId === null) {
            echo "Admin user already exists\n";
        }
    }

    private function seedEmployees(): void
    {
        $employees = [
            [
                'username' => 'juan.perez',
                'password' => 'employee123',
                'code' => 'EMP001',
                'full_name' => 'Juan Pérez',
                'marital_status' => 'single',
                'identity_document' => '1234567890',
                'birth_date' => '1990-05-15',
                'age' => 33,
                'address_street' => 'Calle Principal',
                'address_house' => '123',
                'address_city' => 'Ciudad',
                'address_state' => 'Estado',
                'position' => 'Manager',
                'department' => 'Sales',
                'salary' => 5000.00,
                'profession' => 'Business Administration',
                'emails' => 'juan.perez@company.com',
                'phones' => '123-456-7890',
                'role' => 'employee'
            ],
            [
                'username' => 'maria.garcia',
                'password' => 'employee123',
                'code' => 'EMP002',
                'full_name' => 'María García',
                'marital_status' => 'married',
                'identity_document' => '0987654321',
                'birth_date' => '1988-08-20',
                'age' => 35,
                'address_street' => 'Avenida Central',
                'address_house' => '456',
                'address_city' => 'Ciudad',
                'address_state' => 'Estado',
                'position' => 'Accountant',
                'department' => 'Finance',
                'salary' => 4500.00,
                'profession' => 'Accounting',
                'emails' => 'maria.garcia@company.com',
                'phones' => '098-765-4321',
                'role' => 'cashier'
            ]
        ];

        foreach ($employees as $employee) {
            $this->pdo->beginTransaction();
            try {
                $userId = $this->insertUser($employee['username'], $employee['password'], $employee['role']);

                if ($userId === null) {
                    echo "Employee user {$employee['username']} already exists\n";
                    $this->pdo->rollBack();
                    continue;
                }

                // Insert employee
                $employeeSql = "INSERT INTO employees (
                    user_id, code, full_name, marital_status, identity_document, 
                    birth_date, age, address_street, address_house, address_city, 
                    address_state, position, department, salary, profession, 
                    emails, phones
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

                $employeeStmt = $this->pdo->prepare($employeeSql);
                $employeeStmt->execute([
                    $userId,
                    $employee['code'],
                    $employee['full_name'],
                    $employee['marital_status'],
                    $employee['identity_document'],
                    $employee['birth_date'],
                    $employee['age'],
                    $employee['address_street'],
                    $employee['address_house'],
                    $employee['address_city'],
                    $employee['address_state'],
                    $employee['position'],
                    $employee['department'],
                    $employee['salary'],
                    $employee['profession'],
                    $employee['emails'],
                    $employee['phones']
                ]);

                $this->pdo->commit();
            } catch (\Exception $e) {
                $this->pdo->rollBack();
                throw $e;
            }
        }
    }

    private function seedClients(): void
    {
        $clients = [
            [
                'username' => 'carlos.lopez',
                'password' => 'client123',
                'full_name' => 'Carlos López',
                'identity_document' => '111222333',
                'birth_date' => '1995-03-10',
                'age' => 28,
                'marital_status' => 'single',
                'profession' => 'Engineer',
                'emails' => 'carlos.lopez@email.com',
                'phones' => '111-222-3333',
                'address_street' => 'Calle Secundaria',
                'address_house' => '789',
                'address_city' => 'Ciudad',
                'address_state' => 'Estado',
                'workplace' => 'Tech Company',
                'workplace_address' => '123 Tech Street',
                'monthly_income' => 3000.00,
                'additional_income' => 500.00
            ],
            [
                'username' => 'ana.martinez',
                'password' => 'client123',
                'full_name' => 'Ana Martínez',
                'identity_document' => '444555666',
                'birth_date' => '1992-07-25',
                'age' => 31,
                'marital_status' => 'married',
                'profession' => 'Doctor',
                'emails' => 'ana.martinez@email.com',
                'phones' => '444-555-6666',
                'address_street' => 'Avenida Principal',
                'address_house' => '101',
                'address_city' => 'Ciudad',
                'address_state' => 'Estado',
                'workplace' => 'City Hospital',
                'workplace_address' => '456 Medical Center',
                'monthly_income' => 6000.00,
                'additional_income' => 1000.00
            ]
        ];

        foreach ($clients as $client) {
            $this->pdo->beginTransaction();
            try {
                $userId = $this->insertUser($client['username'], $client['password'], 'client');

                if ($userId === null) {
                    echo "Client user {$client['username']} already exists\n";
                    $this->pdo->rollBack();
                    continue;
                }

                // Insert client
                $clientSql = "INSERT INTO clients (
                    user_id, full_name, identity_document, birth_date, age,
                    marital_status, profession, emails, phones, address_street,
                    address_house, address_city, address_state, workplace,
                    workplace_address, monthly_income, additional_income
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

                $clientStmt = $this->pdo->prepare($clientSql);
                $clientStmt->execute([
                    $userId,
                    $client['full_name'],
                    $client['identity_document'],
                    $client['birth_date'],
                    $client['age'],
                    $client['marital_status'],
                    $client['profession'],
                    $client['emails'],
                    $client['phones'],
                    $client['address_street'],
                    $client['address_house'],
                    $client['address_city'],
                    $client['address_state'],
                    $client['workplace'],
                    $client['workplace_address'],
                    $client['monthly_income'],
                    $client['additional_income']
                ]);

                $this->pdo->commit();
            } catch (\Exception $e) {
                $this->pdo->rollBack();
                throw $e;
            }
        }
    }
}
