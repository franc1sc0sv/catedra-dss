<?php

namespace App\Services;

use App\Utils\Logger;
use PDO;

class InsuranceService
{
    public function __construct(private PDO $pdo) {}

    private function validateInsuranceData(array $data): ?string
    {
        if (empty($data['client_id'])) {
            return 'El ID del cliente es requerido';
        }

        if (empty($data['reference_number'])) {
            return 'El número de referencia es requerido';
        }

        if (empty($data['type'])) {
            return 'El tipo de seguro es requerido';
        }

        // Cambia coverage_amount por insured_amount
        if (!isset($data['insured_amount']) || $data['insured_amount'] <= 0) {
            return 'El monto asegurado debe ser mayor a 0';
        }

        // Cambia monthly_premium por fee_amount
        if (!isset($data['fee_amount']) || $data['fee_amount'] <= 0) {
            return 'La cuota debe ser mayor a 0';
        }

        // Cambia start_date por contract_date
        if (empty($data['contract_date'])) {
            return 'La fecha de contrato es requerida';
        }

        if (empty($data['end_date'])) {
            return 'La fecha de finalización es requerida';
        }

        if (strtotime($data['end_date']) <= strtotime($data['contract_date'])) {
            return 'La fecha de finalización debe ser posterior a la fecha de contrato';
        }

        return null;
    }

    public function create(array $data): array
    {
        $error = $this->validateInsuranceData($data);
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

            // Verificar si el número de póliza ya existe
            $stmt = $this->pdo->prepare('SELECT id FROM insurances WHERE reference_number = ?');
            $stmt->execute([$data['reference_number']]);
            if ($stmt->fetch()) {
                throw new \RuntimeException('El número de referencia ya existe');
            }

            $this->pdo->beginTransaction();

            $stmt = $this->pdo->prepare("
                INSERT INTO insurances (
                    client_id, reference_number, type, contract_date, end_date,
                    payment_frequency, fee_amount, insured_amount, daily_hospital_rent,
                    coverage_conditions, assistance_type, insurance_status, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
                RETURNING id
            ");

            $stmt->execute([
                $data['client_id'],
                $data['reference_number'],
                $data['type'],
                $data['contract_date'],
                $data['end_date'],
                $data['payment_frequency'],
                $data['fee_amount'],
                $data['insured_amount'],
                $data['daily_hospital_rent'] ?? null,
                $data['coverage_conditions'] ?? null,
                $data['assistance_type'] ?? null,
                'active'
            ]);
            $insuranceId = $stmt->fetchColumn();

            $this->pdo->commit();

            return $this->getById($insuranceId);
        } catch (\Throwable $e) {
            $this->pdo->rollBack();
            Logger::error("Error creating insurance: " . $e->getMessage());
            throw $e;
        }
    }

    public function list(): array
    {
        try {
            $stmt = $this->pdo->query('
                SELECT i.*, c.full_name as client_name
                FROM insurances i
                JOIN clients c ON i.client_id = c.id
                ORDER BY i.created_at DESC
            ');

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (\Throwable $e) {
            Logger::error("Error listing insurances: " . $e->getMessage());
            throw $e;
        }
    }

    public function getById(string $id): ?array
    {
        try {
            $stmt = $this->pdo->prepare('
                SELECT i.*, c.full_name as client_name
                FROM insurances i
                JOIN clients c ON i.client_id = c.id
                WHERE i.id = ?
            ');
            $stmt->execute([$id]);
            return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
        } catch (\Throwable $e) {
            Logger::error("Error getting insurance: " . $e->getMessage());
            throw $e;
        }
    }

    public function close(string $id): bool
    {
        try {
            $stmt = $this->pdo->prepare('
                UPDATE insurances 
                SET status = ?, closed_at = NOW()
                WHERE id = ? AND status = ?
            ');

            $result = $stmt->execute(['closed', $id, 'active']);
            return $stmt->rowCount() > 0;
        } catch (\Throwable $e) {
            Logger::error("Error closing insurance: " . $e->getMessage());
            throw $e;
        }
    }
}
