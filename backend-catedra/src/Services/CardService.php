<?php

namespace App\Services;

use App\Utils\Logger;
use PDO;
use Respect\Validation\Validator as v;
use Respect\Validation\Exceptions\ValidationException;

class CardService
{
    public function __construct(private PDO $pdo) {}

    private function validateCardData(array $data): string|null
    {
        // Validar client_id
        try {
            v::uuid()->assert($data['client_id']);
        } catch (ValidationException $e) {
            return 'ID de cliente inválido';
        }

        // Validar card_number
        try {
            v::stringType()->notEmpty()->length(13, 19)->assert($data['card_number']);
        } catch (ValidationException $e) {
            return 'El número de tarjeta debe tener entre 13 y 19 caracteres';
        }

        // Validar limit_amount
        try {
            v::number()->positive()->between(0, 999999.99)->assert($data['limit_amount']);
        } catch (ValidationException $e) {
            return 'El límite debe ser un número positivo entre 0 y 999999.99';
        }

        // Validar network
        try {
            v::stringType()->notEmpty()->in(['Visa', 'MasterCard'])->assert($data['network']);
        } catch (ValidationException $e) {
            return 'La red debe ser Visa o MasterCard';
        }

        // Validar category
        try {
            v::stringType()->notEmpty()->in(['Classic', 'Infinite', 'Gold', 'Platinum', 'Business'])->assert($data['category']);
        } catch (ValidationException $e) {
            return 'La categoría debe ser Classic, Infinite, Gold, Platinum o Business';
        }

        // Validar interest_rate
        try {
            v::number()->positive()->between(0, 100)->assert($data['interest_rate']);
        } catch (ValidationException $e) {
            return 'La tasa de interés debe ser un número positivo entre 0 y 100';
        }

        // Validar membership_fee
        try {
            v::number()->positive()->between(0, 9999.99)->assert($data['membership_fee']);
        } catch (ValidationException $e) {
            return 'La cuota de membresía debe ser un número positivo entre 0 y 9999.99';
        }

        return null;
    }

    public function create(array $data): array
    {
        try {
            $this->pdo->beginTransaction();

            // Validar datos de la tarjeta
            $error = $this->validateCardData($data);
            if ($error) {
                throw new \RuntimeException($error);
            }

            // Verificar si el cliente existe
            $stmt = $this->pdo->prepare("SELECT id FROM clients WHERE id = ?");
            $stmt->execute([$data['client_id']]);
            if (!$stmt->fetch()) {
                throw new \RuntimeException("Cliente no encontrado");
            }

            // Verificar si el número de tarjeta ya existe
            $stmt = $this->pdo->prepare("SELECT id FROM cards WHERE card_number = ?");
            $stmt->execute([$data['card_number']]);
            if ($stmt->fetch()) {
                throw new \RuntimeException("El número de tarjeta ya está en uso");
            }

            // Crear la tarjeta
            $stmt = $this->pdo->prepare(
                "INSERT INTO cards (
                    client_id, card_number, issue_date, limit_amount, network,
                    category, interest_rate, membership_fee, card_status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')
                RETURNING id"
            );
            $stmt->execute([
                $data['client_id'],
                $data['card_number'],
                $data['issue_date'],
                $data['limit_amount'],
                $data['network'],
                $data['category'],
                $data['interest_rate'],
                $data['membership_fee']
            ]);
            $cardId = $stmt->fetchColumn();

            $this->pdo->commit();

            return $this->getById($cardId);
        } catch (\Throwable $e) {
            $this->pdo->rollBack();
            Logger::error("Error creating card: " . $e->getMessage());
            throw new \RuntimeException($e->getMessage());
        }
    }

    public function list(): array
    {
        try {
            $stmt = $this->pdo->query(
                "SELECT * FROM cards ORDER BY created_at DESC"
            );
            return $stmt->fetchAll();
        } catch (\Throwable $e) {
            Logger::error("Error listing cards: " . $e->getMessage());
            throw new \RuntimeException("Error listing cards");
        }
    }

    public function getById(string $id): ?array
    {
        try {
            $stmt = $this->pdo->prepare(
                "SELECT * FROM cards WHERE id = ?"
            );
            $stmt->execute([$id]);
            return $stmt->fetch() ?: null;
        } catch (\Throwable $e) {
            Logger::error("Error getting card: " . $e->getMessage());
            throw new \RuntimeException("Error getting card");
        }
    }

    public function close(string $id): bool
    {
        try {
            $stmt = $this->pdo->prepare(
                "UPDATE cards 
                SET card_status = 'closed',
                    closing_date = CURRENT_TIMESTAMP
                WHERE id = ? AND card_status = 'active'
                RETURNING id"
            );
            $stmt->execute([$id]);
            return (bool) $stmt->fetchColumn();
        } catch (\Throwable $e) {
            Logger::error("Error closing card: " . $e->getMessage());
            throw new \RuntimeException("Error closing card");
        }
    }
}
