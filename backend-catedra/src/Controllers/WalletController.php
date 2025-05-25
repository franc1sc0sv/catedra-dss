<?php

namespace App\Controllers;

use App\Services\WalletService;
use Psr\Http\Message\ServerRequestInterface;
use React\Http\Message\Response;
use Exception;

class WalletController
{
    private $walletService;

    public function __construct(WalletService $walletService)
    {
        $this->walletService = $walletService;
    }

    public function getWalletData(ServerRequestInterface $request): Response
    {
        try {
            // Obtener el ID del cliente del token JWT
            $token = $request->getHeaderLine('Authorization');
            if (empty($token)) {
                return Response::json([
                    'error' => 'Token no proporcionado'
                ], 401);
            }

            // Extraer el ID del cliente del token
            $tokenParts = explode('.', str_replace('Bearer ', '', $token));
            $payload = json_decode(base64_decode($tokenParts[1]), true);
            $clientId = $payload['client_id'] ?? null;

            if (!$clientId) {
                return Response::json([
                    'error' => 'ID de cliente no encontrado en el token'
                ], 401);
            }

            $walletData = $this->walletService->getWalletData($clientId);

            return Response::json([
                'data' => $walletData
            ]);
        } catch (Exception $e) {
            return Response::json([
                'error' => $e->getMessage()
            ], 400);
        }
    }
}
