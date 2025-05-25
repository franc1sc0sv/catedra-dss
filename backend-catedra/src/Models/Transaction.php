<?php

namespace App\Models;

class Transaction
{
    private $id;
    private $referenceNumber;
    private $referenceId;
    private $referenceType;
    private $clientId;
    private $description;
    private $createdBy;
    private $amount;
    private $transactionType;
    private $transactionCode;
    private $createdAt;

    public function __construct(
        string $referenceNumber,
        string $referenceId,
        string $referenceType,
        string $clientId,
        string $description,
        string $createdBy,
        float $amount,
        string $transactionType,
        string $transactionCode
    ) {
        $this->referenceNumber = $referenceNumber;
        $this->referenceId = $referenceId;
        $this->referenceType = $referenceType;
        $this->clientId = $clientId;
        $this->description = $description;
        $this->createdBy = $createdBy;
        $this->amount = $amount;
        $this->transactionType = $transactionType;
        $this->transactionCode = $transactionCode;
        $this->createdAt = date('Y-m-d H:i:s');
    }

    public function getId(): string
    {
        return $this->id;
    }

    public function getReferenceNumber(): string
    {
        return $this->referenceNumber;
    }

    public function getReferenceId(): string
    {
        return $this->referenceId;
    }

    public function getReferenceType(): string
    {
        return $this->referenceType;
    }

    public function getClientId(): string
    {
        return $this->clientId;
    }

    public function getDescription(): string
    {
        return $this->description;
    }

    public function getCreatedBy(): string
    {
        return $this->createdBy;
    }

    public function getAmount(): float
    {
        return $this->amount;
    }

    public function getTransactionType(): string
    {
        return $this->transactionType;
    }

    public function getTransactionCode(): string
    {
        return $this->transactionCode;
    }

    public function getCreatedAt(): string
    {
        return $this->createdAt;
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'reference_number' => $this->referenceNumber,
            'reference_id' => $this->referenceId,
            'reference_type' => $this->referenceType,
            'client_id' => $this->clientId,
            'description' => $this->description,
            'created_by' => $this->createdBy,
            'amount' => $this->amount,
            'transaction_type' => $this->transactionType,
            'transaction_code' => $this->transactionCode,
            'created_at' => $this->createdAt
        ];
    }
}
