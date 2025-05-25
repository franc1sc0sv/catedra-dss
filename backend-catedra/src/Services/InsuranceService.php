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

        if (empty($data['policy_number'])) {
            return 'El número de póliza es requerido';
        }

        if (empty($data['type'])) {
            return 'El tipo de seguro es requerido';
        }

        if (!isset($data['coverage_amount']) || $data['coverage_amount'] <= 0) {
            return 'El monto de cobertura debe ser mayor a 0';
        }

        if (!isset($data['monthly_premium']) || $data['monthly_premium'] <= 0) {
            return 'La prima mensual debe ser mayor a 0';
        }

        if (empty($data['start_date'])) {
            return 'La fecha de inicio es requerida';
        }

        if (empty($data['end_date'])) {
            return 'La fecha de finalización es requerida';
        }

        if (strtotime($data['end_date']) <= strtotime($data['start_date'])) {
            return 'La fecha de finalización debe ser posterior a la fecha de inicio';
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
            $stmt = $this->pdo->prepare('SELECT id FROM insurances WHERE policy_number = ?');
            $stmt->execute([$data['policy_number']]);
            if ($stmt->fetch()) {
                throw new \RuntimeException('El número de póliza ya existe');
            }

            $this->pdo->beginTransaction();

            $stmt = $this->pdo->prepare('
                INSERT INTO insurances (
                    client_id, policy_number, type, coverage_amount,
                    monthly_premium, start_date, end_date, status, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
            ');

            $stmt->execute([
                $data['client_id'],
                $data['policy_number'],
                $data['type'],
                $data['coverage_amount'],
                $data['monthly_premium'],
                $data['start_date'],
                $data['end_date'],
                'active'
            ]);

            $insuranceId = $this->pdo->lastInsertId();

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
