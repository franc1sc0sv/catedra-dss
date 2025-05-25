<?php

namespace App\Services;

use App\Models\Transaction;
use PDO;
use Exception;

class TransactionService
{
    private $db;
    private $accountService;
    private $cardService;
    private $loanService;
    private $insuranceService;

    public function __construct(PDO $db)
    {
        $this->db = $db;
        $this->accountService = new AccountService($db);
        $this->cardService = new CardService($db);
        $this->loanService = new LoanService($db);
        $this->insuranceService = new InsuranceService($db);
    }

    public function createTransaction(array $data): Transaction
    {
        try {
            $this->db->beginTransaction();

            // Validar datos básicos
            $this->validateTransactionData($data);

            // Validar que el producto financiero existe y pertenece al cliente
            $this->validateFinancialProduct($data);

            // Validar montos según el tipo de transacción y producto
            $this->validateAmounts($data);

            // Generar código único de transacción
            $transactionCode = $this->generateTransactionCode();

            // Crear la transacción
            $transaction = new Transaction(
                $data['reference_number'],
                $data['reference_id'],
                $data['reference_type'],
                $data['client_id'],
                $data['description'],
                $data['created_by'],
                $data['amount'],
                $data['transaction_type'],
                $transactionCode
            );

            // Ejecutar la transacción según el tipo
            $this->executeTransaction($transaction);

            // Registrar la transacción en la base de datos
            $this->saveTransaction($transaction);

            $this->db->commit();
            return $transaction;
        } catch (Exception $e) {
            $this->db->rollBack();
            throw $e;
        }
    }

    private function validateTransactionData(array $data): void
    {
        $requiredFields = [
            'reference_number',
            'reference_id',
            'reference_type',
            'client_id',
            'description',
            'created_by',
            'amount',
            'transaction_type'
        ];

        foreach ($requiredFields as $field) {
            if (!isset($data[$field]) || empty($data[$field])) {
                throw new Exception("El campo {$field} es requerido");
            }
        }

        if (!in_array($data['reference_type'], ['account', 'card', 'loan', 'insurance'])) {
            throw new Exception("Tipo de referencia inválido");
        }

        if (!in_array($data['transaction_type'], [
            'deposit',
            'withdrawal',
            'transfer',
            'payment',
            'fee',
            'interest',
            'penalty',
            'adjustment'
        ])) {
            throw new Exception("Tipo de transacción inválido");
        }
    }

    private function validateFinancialProduct(array $data): void
    {
        $stmt = $this->db->prepare("
            SELECT id FROM {$data['reference_type']}s 
            WHERE id = ? AND client_id = ? AND product_status = 'active'
        ");
        $stmt->execute([$data['reference_id'], $data['client_id']]);

        if (!$stmt->fetch()) {
            throw new Exception("El producto financiero no existe o no pertenece al cliente");
        }
    }

    private function validateAmounts(array $data): void
    {
        switch ($data['reference_type']) {
            case 'account':
                $this->validateAccountAmounts($data);
                break;
            case 'card':
                $this->validateCardAmounts($data);
                break;
            case 'loan':
                $this->validateLoanAmounts($data);
                break;
            case 'insurance':
                $this->validateInsuranceAmounts($data);
                break;
        }
    }

    private function validateAccountAmounts(array $data): void
    {
        $account = $this->accountService->getById($data['reference_id']);

        if ($data['transaction_type'] === 'withdrawal' && $account['amount'] < $data['amount']) {
            throw new Exception("Fondos insuficientes en la cuenta");
        }
    }

    private function validateCardAmounts(array $data): void
    {
        $card = $this->cardService->getById($data['reference_id']);

        if ($data['transaction_type'] === 'payment' && $data['amount'] > $card['limit_amount']) {
            throw new Exception("El monto excede el límite de la tarjeta");
        }
    }

    private function validateLoanAmounts(array $data): void
    {
        $loan = $this->loanService->getById($data['reference_id']);

        if ($data['transaction_type'] === 'payment' && $data['amount'] < $loan['monthly_payment']) {
            throw new Exception("El monto del pago es menor al pago mensual requerido");
        }
    }

    private function validateInsuranceAmounts(array $data): void
    {
        $insurance = $this->insuranceService->getById($data['reference_id']);

        if ($data['transaction_type'] === 'payment' && $data['amount'] < $insurance['fee_amount']) {
            throw new Exception("El monto del pago es menor a la cuota del seguro");
        }
    }

    private function executeTransaction(Transaction $transaction): void
    {
        switch ($transaction->getReferenceType()) {
            case 'account':
                $this->executeAccountTransaction($transaction);
                break;
            case 'card':
                $this->executeCardTransaction($transaction);
                break;
            case 'loan':
                $this->executeLoanTransaction($transaction);
                break;
            case 'insurance':
                $this->executeInsuranceTransaction($transaction);
                break;
        }
    }

    private function executeAccountTransaction(Transaction $transaction): void
    {
        $stmt = $this->db->prepare("
            UPDATE accounts 
            SET amount = CASE 
                WHEN ? = 'deposit' THEN amount + ?
                WHEN ? = 'withdrawal' THEN amount - ?
                ELSE amount
            END
            WHERE id = ?
        ");

        $stmt->execute([
            $transaction->getTransactionType(),
            $transaction->getAmount(),
            $transaction->getTransactionType(),
            $transaction->getAmount(),
            $transaction->getReferenceId()
        ]);
    }

    private function executeCardTransaction(Transaction $transaction): void
    {
        // Implementar lógica específica para tarjetas
        // Por ejemplo, actualizar el límite disponible
    }

    private function executeLoanTransaction(Transaction $transaction): void
    {
        // Implementar lógica específica para préstamos
        // Por ejemplo, actualizar el saldo pendiente
    }

    private function executeInsuranceTransaction(Transaction $transaction): void
    {
        // Implementar lógica específica para seguros
        // Por ejemplo, registrar el pago de la prima
    }

    private function saveTransaction(Transaction $transaction): void
    {
        $stmt = $this->db->prepare("
            INSERT INTO transactions (
                reference_number, reference_id, reference_type,
                client_id, description, created_by, amount,
                transaction_type, transaction_code, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");

        $stmt->execute([
            $transaction->getReferenceNumber(),
            $transaction->getReferenceId(),
            $transaction->getReferenceType(),
            $transaction->getClientId(),
            $transaction->getDescription(),
            $transaction->getCreatedBy(),
            $transaction->getAmount(),
            $transaction->getTransactionType(),
            $transaction->getTransactionCode(),
            $transaction->getCreatedAt()
        ]);
    }

    private function generateTransactionCode(): string
    {
        return 'TRX-' . strtoupper(uniqid());
    }

    public function getTransactionsByClient(string $clientId): array
    {
        $stmt = $this->db->prepare("
            SELECT * FROM transactions 
            WHERE client_id = ? 
            ORDER BY created_at DESC
        ");
        $stmt->execute([$clientId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getTransactionsByProduct(string $referenceId, string $referenceType): array
    {
        $stmt = $this->db->prepare("
            SELECT * FROM transactions 
            WHERE reference_id = ? AND reference_type = ? 
            ORDER BY created_at DESC
        ");
        $stmt->execute([$referenceId, $referenceType]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
