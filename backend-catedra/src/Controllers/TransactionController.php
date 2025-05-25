<?php

namespace App\Controllers;

use App\Services\TransactionService;
use Psr\Http\Message\ServerRequestInterface;
use React\Http\Message\Response;
use Exception;

class TransactionController
{
    private $transactionService;

    public function __construct(TransactionService $transactionService)
    {
        $this->transactionService = $transactionService;
    }

    public function create(ServerRequestInterface $request): Response
    {
        try {
            $data = json_decode($request->getBody()->getContents(), true);

            if (!$data) {
                return Response::json([
                    'error' => 'Invalid JSON data'
                ], 400);
            }

            $transaction = $this->transactionService->createTransaction($data);

            return Response::json([
                'message' => 'Transaction created successfully',
                'data' => $transaction->toArray()
            ], 201);
        } catch (Exception $e) {
            return Response::json([
                'error' => $e->getMessage()
            ], 400);
        }
    }

    public function getByClient(ServerRequestInterface $request, array $args): Response
    {
        try {
            $clientId = $args['clientId'] ?? null;

            if (!$clientId) {
                return Response::json([
                    'error' => 'Client ID is required'
                ], 400);
            }

            $transactions = $this->transactionService->getTransactionsByClient($clientId);

            return Response::json([
                'data' => $transactions
            ]);
        } catch (Exception $e) {
            return Response::json([
                'error' => $e->getMessage()
            ], 400);
        }
    }

    public function getByProduct(ServerRequestInterface $request, array $args): Response
    {
        try {
            $referenceId = $args['referenceId'] ?? null;
            $referenceType = $args['referenceType'] ?? null;

            if (!$referenceId || !$referenceType) {
                return Response::json([
                    'error' => 'Reference ID and type are required'
                ], 400);
            }

            $transactions = $this->transactionService->getTransactionsByProduct($referenceId, $referenceType);

            return Response::json([
                'data' => $transactions
            ]);
        } catch (Exception $e) {
            return Response::json([
                'error' => $e->getMessage()
            ], 400);
        }
    }
}
