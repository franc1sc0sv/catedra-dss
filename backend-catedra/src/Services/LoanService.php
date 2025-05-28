<?php

namespace App\Services;

use App\Utils\Logger;
use PDO;

class LoanService
{
    public function __construct(private PDO $pdo) {}

    private function validateLoanData(array $data): ?string
    {
        if (empty($data['client_id'])) {
            return 'El ID del cliente es requerido';
        }

        if (empty($data['reference_number'])) {
            return 'El número de préstamo es requerido';
        }

        if (!isset($data['loan_amount']) || $data['loan_amount'] <= 0) {
            return 'El monto del préstamo debe ser mayor a 0';
        }

        if (empty($data['category'])) {
            return 'La categoría del préstamo es requerida';
        }

        if (!isset($data['interest_rate']) || $data['interest_rate'] < 0) {
            return 'La tasa de interés debe ser mayor o igual a 0';
        }

        if (!isset($data['payment_terms']) || $data['payment_terms'] <= 0) {
            return 'El plazo en meses debe ser mayor a 0';
        }

        // Puedes agregar validaciones para los otros campos si lo deseas

        return null;
    }

    public function create(array $data): array
    {
        $error = $this->validateLoanData($data);
        if ($error) {
            throw new \RuntimeException($error);
        }

        try {
            // Verificar si el cliente existe
            $stmt = $this->pdo->prepare('SELECT id FROM clients WHERE id = ?');
            $stmt->execute([$data['client_id']]);
            if (!$stmt->fetch()) {
                throw new \RuntimeException('Cliente no encontrado');
            }

            // Verificar si el número de préstamo ya existe
            $stmt = $this->pdo->prepare('SELECT id FROM loans WHERE reference_number = ?');
            $stmt->execute([$data['reference_number']]);
            if ($stmt->fetch()) {
                throw new \RuntimeException('El número de préstamo ya existe');
            }

            $this->pdo->beginTransaction();

            // Insertar el préstamo
            $stmt = $this->pdo->prepare('
                INSERT INTO loans (
                    client_id, reference_number, issue_date, loan_amount, payment_terms, monthly_payment, due_date, interest_rate, insurance_fee, beneficiaries, category, loan_status, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
            ');
            $stmt->execute([
                $data['client_id'],
                $data['reference_number'],
                $data['issue_date'],
                $data['loan_amount'],
                $data['payment_terms'],
                $data['monthly_payment'],
                $data['due_date'],
                $data['interest_rate'],
                $data['insurance_fee'],
                $data['beneficiaries'],
                $data['category'],
                $data['loan_status'] ?? 'active'
            ]);

            // Recuperar el préstamo recién insertado usando reference_number
            $stmt = $this->pdo->prepare('SELECT * FROM loans WHERE reference_number = ?');
            $stmt->execute([$data['reference_number']]);
            $loan = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$loan) {
                throw new \RuntimeException('No se pudo recuperar el préstamo insertado');
            }

            $this->pdo->commit();

            return $loan;
        } catch (\Throwable $e) {
            $this->pdo->rollBack();
            Logger::error("Error creating loan: " . $e->getMessage());
            throw $e;
        }
    }

    public function list(): array
    {
        try {
            $stmt = $this->pdo->query('
                SELECT l.*, c.full_name as client_name
                FROM loans l
                JOIN clients c ON l.client_id = c.id
                ORDER BY l.created_at DESC
            ');

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (\Throwable $e) {
            Logger::error("Error listing loans: " . $e->getMessage());
            throw $e;
        }
    }

    public function getById(string $id): ?array
    {
        try {
            $stmt = $this->pdo->prepare('
                SELECT l.*, c.full_name as client_name
                FROM loans l
                JOIN clients c ON l.client_id = c.id
                WHERE l.id = ?
            ');
            $stmt->execute([$id]);
            return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
        } catch (\Throwable $e) {
            Logger::error("Error getting loan: " . $e->getMessage());
            throw $e;
        }
    }

    public function close(string $id): bool
    {
        try {
            $stmt = $this->pdo->prepare('
                UPDATE loans 
                SET status = ?, closed_at = NOW()
                WHERE id = ? AND status = ?
            ');

            $result = $stmt->execute(['closed', $id, 'active']);
            return $stmt->rowCount() > 0;
        } catch (\Throwable $e) {
            Logger::error("Error closing loan: " . $e->getMessage());
            throw $e;
        }
    }
}
