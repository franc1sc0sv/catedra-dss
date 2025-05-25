<?php

namespace App\Services;

use App\Utils\Logger;
use PDO;
use Respect\Validation\Validator as v;
use Respect\Validation\Exceptions\ValidationException;

class AccountService
{
    public function __construct(private PDO $pdo) {}

    private function validateAccountData(array $data): string|null
    {
        // Validar client_id
        try {
            v::uuid()->assert($data['client_id']);
        } catch (ValidationException $e) {
            return 'ID de cliente inválido';
        }

        // Validar account_number
        try {
            v::stringType()->notEmpty()->length(5, 20)->assert($data['account_number']);
        } catch (ValidationException $e) {
            return 'El número de cuenta debe tener entre 5 y 20 caracteres';
        }

        // Validar amount
        try {
            v::numeric()->positive()->between(0, 999999999.99)->assert($data['amount']);
        } catch (ValidationException $e) {
            return 'El monto debe ser un número positivo entre 0 y 999999999.99';
        }

        // Validar beneficiarios
        if (!isset($data['beneficiaries']) || !is_array($data['beneficiaries'])) {
            return 'Debe proporcionar al menos un beneficiario';
        }

        foreach ($data['beneficiaries'] as $beneficiary) {
            // Validar full_name
            try {
                v::stringType()->notEmpty()->length(3, 150)->assert($beneficiary['full_name']);
            } catch (ValidationException $e) {
                return 'El nombre del beneficiario debe tener entre 3 y 150 caracteres';
            }

            // Validar relationship
            try {
                v::stringType()->notEmpty()->length(2, 50)->assert($beneficiary['relationship']);
            } catch (ValidationException $e) {
                return 'La relación con el beneficiario debe tener entre 2 y 50 caracteres';
            }

            // Validar percentage
            try {
                v::numeric()->between(0, 100)->assert($beneficiary['percentage']);
            } catch (ValidationException $e) {
                return 'El porcentaje debe estar entre 0 y 100';
            }
        }

        // Validar que la suma de porcentajes sea 100
        $totalPercentage = array_sum(array_column($data['beneficiaries'], 'percentage'));
        if ($totalPercentage != 100) {
            return 'La suma de los porcentajes de los beneficiarios debe ser 100';
        }

        return null;
    }

    public function create(array $data): array
    {
        try {
            $this->pdo->beginTransaction();

            // Validar datos de la cuenta
            $error = $this->validateAccountData($data);
            if ($error) {
                throw new \RuntimeException($error);
            }

            // Verificar si el cliente existe
            $stmt = $this->pdo->prepare("SELECT id FROM clients WHERE id = ?");
            $stmt->execute([$data['client_id']]);
            if (!$stmt->fetch()) {
                throw new \RuntimeException("Cliente no encontrado");
            }

            // Verificar si el número de cuenta ya existe
            $stmt = $this->pdo->prepare("SELECT id FROM accounts WHERE account_number = ?");
            $stmt->execute([$data['account_number']]);
            if ($stmt->fetch()) {
                throw new \RuntimeException("El número de cuenta ya está en uso");
            }

            // Crear la cuenta
            $stmt = $this->pdo->prepare(
                "INSERT INTO accounts (
                    client_id, account_number, amount, account_status
                ) VALUES (?, ?, ?, 'active')
                RETURNING id"
            );
            $stmt->execute([
                $data['client_id'],
                $data['account_number'],
                $data['amount']
            ]);
            $accountId = $stmt->fetchColumn();

            // Crear los beneficiarios
            $stmt = $this->pdo->prepare(
                "INSERT INTO account_beneficiaries (
                    account_id, full_name, relationship, percentage
                ) VALUES (?, ?, ?, ?)"
            );

            foreach ($data['beneficiaries'] as $beneficiary) {
                $stmt->execute([
                    $accountId,
                    $beneficiary['full_name'],
                    $beneficiary['relationship'],
                    $beneficiary['percentage']
                ]);
            }

            $this->pdo->commit();

            return $this->getById($accountId);
        } catch (\Throwable $e) {
            $this->pdo->rollBack();
            Logger::error("Error creating account: " . $e->getMessage());
            throw new \RuntimeException($e->getMessage());
        }
    }

    public function list(): array
    {
        try {
            $stmt = $this->pdo->query(
                "SELECT 
                    a.*,
                    json_agg(
                        json_build_object(
                            'id', ab.id,
                            'full_name', ab.full_name,
                            'relationship', ab.relationship,
                            'percentage', ab.percentage,
                            'created_at', ab.created_at
                        )
                    ) as beneficiaries
                FROM accounts a
                LEFT JOIN account_beneficiaries ab ON a.id = ab.account_id
                GROUP BY a.id
                ORDER BY a.created_at DESC"
            );
            return $stmt->fetchAll();
        } catch (\Throwable $e) {
            Logger::error("Error listing accounts: " . $e->getMessage());
            throw new \RuntimeException("Error listing accounts");
        }
    }

    public function getById(string $id): ?array
    {
        try {
            $stmt = $this->pdo->prepare(
                "SELECT 
                    a.*,
                    json_agg(
                        json_build_object(
                            'id', ab.id,
                            'full_name', ab.full_name,
                            'relationship', ab.relationship,
                            'percentage', ab.percentage,
                            'created_at', ab.created_at
                        )
                    ) as beneficiaries
                FROM accounts a
                LEFT JOIN account_beneficiaries ab ON a.id = ab.account_id
                WHERE a.id = ?
                GROUP BY a.id"
            );
            $stmt->execute([$id]);
            return $stmt->fetch() ?: null;
        } catch (\Throwable $e) {
            Logger::error("Error getting account: " . $e->getMessage());
            throw new \RuntimeException("Error getting account");
        }
    }

    public function close(string $id): bool
    {
        try {
            $stmt = $this->pdo->prepare(
                "UPDATE accounts 
                SET account_status = 'closed',
                    closing_date = CURRENT_TIMESTAMP
                WHERE id = ? AND account_status = 'active'
                RETURNING id"
            );
            $stmt->execute([$id]);
            return (bool) $stmt->fetchColumn();
        } catch (\Throwable $e) {
            Logger::error("Error closing account: " . $e->getMessage());
            throw new \RuntimeException("Error closing account");
        }
    }
}
