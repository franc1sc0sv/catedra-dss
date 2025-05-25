<?php

namespace App\Services;

use App\Utils\Logger;
use PDO;
use Respect\Validation\Validator as v;
use Respect\Validation\Exceptions\ValidationException;

class EmployeeService
{
    public function __construct(private PDO $pdo) {}

    private function validateEmployeeData(array $data): string|null
    {
        // Validar username
        try {
            v::stringType()->notEmpty()->length(3, 50)->assert($data['username']);
        } catch (ValidationException $e) {
            return 'El nombre de usuario debe tener entre 3 y 50 caracteres';
        }

        // Validar password
        try {
            v::stringType()->notEmpty()->length(6, 100)->assert($data['password']);
        } catch (ValidationException $e) {
            return 'La contraseña debe tener entre 6 y 100 caracteres';
        }

        // Validar code
        try {
            v::stringType()->notEmpty()->length(3, 20)->assert($data['code']);
        } catch (ValidationException $e) {
            return 'El código de empleado debe tener entre 3 y 20 caracteres';
        }

        // Validar full_name
        try {
            v::stringType()->notEmpty()->length(3, 100)->assert($data['full_name']);
        } catch (ValidationException $e) {
            return 'El nombre completo debe tener entre 3 y 100 caracteres';
        }

        // Validar marital_status
        try {
            v::stringType()->notEmpty()->in(['single', 'married', 'divorced', 'widowed'])->assert($data['marital_status']);
        } catch (ValidationException $e) {
            return 'El estado civil debe ser: soltero, casado, divorciado o viudo';
        }

        // Validar identity_document
        try {
            v::stringType()->notEmpty()->length(5, 20)->assert($data['identity_document']);
        } catch (ValidationException $e) {
            return 'El documento de identidad debe tener entre 5 y 20 caracteres';
        }

        // Validar birth_date
        try {
            v::date('Y-m-d')->notEmpty()->assert($data['birth_date']);
        } catch (ValidationException $e) {
            return 'La fecha de nacimiento debe tener el formato YYYY-MM-DD';
        }

        // Validar age
        try {
            v::intType()->positive()->between(18, 100)->assert($data['age']);
        } catch (ValidationException $e) {
            return 'La edad debe estar entre 18 y 100 años';
        }

        // Validar position
        try {
            v::stringType()->notEmpty()->length(3, 50)->assert($data['position']);
        } catch (ValidationException $e) {
            return 'El cargo debe tener entre 3 y 50 caracteres';
        }

        // Validar department
        try {
            v::stringType()->notEmpty()->length(3, 50)->assert($data['department']);
        } catch (ValidationException $e) {
            return 'El departamento debe tener entre 3 y 50 caracteres';
        }

        // Validar salary
        try {
            v::numeric()->positive()->between(0, 999999.99)->assert($data['salary']);
        } catch (ValidationException $e) {
            return 'El salario debe ser un número positivo entre 0 y 999999.99';
        }

        // Validar campos opcionales
        if (isset($data['address_street'])) {
            try {
                v::stringType()->length(3, 100)->assert($data['address_street']);
            } catch (ValidationException $e) {
                return 'La calle debe tener entre 3 y 100 caracteres';
            }
        }

        if (isset($data['address_house'])) {
            try {
                v::stringType()->length(1, 20)->assert($data['address_house']);
            } catch (ValidationException $e) {
                return 'El número de casa debe tener entre 1 y 20 caracteres';
            }
        }

        if (isset($data['address_city'])) {
            try {
                v::stringType()->length(3, 50)->assert($data['address_city']);
            } catch (ValidationException $e) {
                return 'La ciudad debe tener entre 3 y 50 caracteres';
            }
        }

        if (isset($data['address_state'])) {
            try {
                v::stringType()->length(3, 50)->assert($data['address_state']);
            } catch (ValidationException $e) {
                return 'El estado debe tener entre 3 y 50 caracteres';
            }
        }

        if (isset($data['profession'])) {
            try {
                v::stringType()->length(3, 100)->assert($data['profession']);
            } catch (ValidationException $e) {
                return 'La profesión debe tener entre 3 y 100 caracteres';
            }
        }

        if (isset($data['emails'])) {
            try {
                v::stringType()->length(5, 255)->assert($data['emails']);
            } catch (ValidationException $e) {
                return 'El email debe tener entre 5 y 255 caracteres';
            }
        }

        if (isset($data['phones'])) {
            try {
                v::stringType()->length(5, 50)->assert($data['phones']);
            } catch (ValidationException $e) {
                return 'El teléfono debe tener entre 5 y 50 caracteres';
            }
        }

        return null;
    }

    public function create(array $data): array
    {
        try {
            $this->pdo->beginTransaction();

            // Validar datos del empleado
            $error = $this->validateEmployeeData($data);
            if ($error) {
                throw new \RuntimeException($error);
            }

            // Check if username already exists
            $stmt = $this->pdo->prepare("SELECT COUNT(*) FROM users WHERE username = ?");
            $stmt->execute([$data['username']]);
            if ($stmt->fetchColumn() > 0) {
                throw new \RuntimeException("El nombre de usuario ya está en uso");
            }

            // Check if code already exists
            $stmt = $this->pdo->prepare("SELECT COUNT(*) FROM employees WHERE code = ?");
            $stmt->execute([$data['code']]);
            if ($stmt->fetchColumn() > 0) {
                throw new \RuntimeException("El código de empleado ya está en uso");
            }

            // Check if identity document already exists
            $stmt = $this->pdo->prepare("SELECT COUNT(*) FROM employees WHERE identity_document = ?");
            $stmt->execute([$data['identity_document']]);
            if ($stmt->fetchColumn() > 0) {
                throw new \RuntimeException("El documento de identidad ya está registrado");
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
            throw new \RuntimeException($e->getMessage());
        }
    }

    public function list(): array
    {
        try {
            $stmt = $this->pdo->query(
                "SELECT 
                    e.*,
                    u.is_active,
                    u.username,
                    u.created_at as user_created_at,
                    u.updated_at as user_updated_at
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

    public function toggleStatus(string $userId): bool
    {
        try {
            $stmt = $this->pdo->prepare(
                "UPDATE users 
                SET is_active = NOT is_active,
                    updated_at = CURRENT_TIMESTAMP
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

    public function getById(string $id): ?array
    {
        try {
            $stmt = $this->pdo->prepare(
                "SELECT 
                    e.*,
                    u.is_active,
                    u.username,
                    u.created_at as user_created_at,
                    u.updated_at as user_updated_at
                FROM employees e 
                JOIN users u ON e.user_id = u.id 
                WHERE e.id = ?"
            );
            $stmt->execute([$id]);
            return $stmt->fetch() ?: null;
        } catch (\Throwable $e) {
            Logger::error("Error getting employee: " . $e->getMessage());
            throw new \RuntimeException("Error getting employee");
        }
    }
}
