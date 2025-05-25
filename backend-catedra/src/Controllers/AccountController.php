<?php

namespace App\Controllers;

use App\Middlewares\RequestParser;
use App\Services\AccountService;
use App\Utils\Logger;
use Psr\Http\Message\ServerRequestInterface;
use React\Http\Message\Response;

class AccountController
{
    public function __construct(private AccountService $accountService) {}

    public function create(ServerRequestInterface $request): Response
    {
        try {
            $data = RequestParser::parse($request);
            $result = $this->accountService->create($data);

            return new Response(201, ['Content-Type' => 'application/json'], json_encode([
                'success' => true,
                'data' => $result
            ]));
        } catch (\RuntimeException $e) {
            return new Response(400, ['Content-Type' => 'application/json'], json_encode([
                'error' => $e->getMessage()
            ]));
        } catch (\Throwable $e) {
            Logger::error("Error creating account: " . $e->getMessage());
            return new Response(500, ['Content-Type' => 'application/json'], json_encode([
                'error' => 'Error al crear la cuenta'
            ]));
        }
    }

    public function list(ServerRequestInterface $request): Response
    {
        try {
            $accounts = $this->accountService->list();
            return new Response(200, ['Content-Type' => 'application/json'], json_encode([
                'success' => true,
                'data' => $accounts
            ]));
        } catch (\Throwable $e) {
            Logger::error("Error listing accounts: " . $e->getMessage());
            return new Response(500, ['Content-Type' => 'application/json'], json_encode([
                'error' => 'Error al listar las cuentas'
            ]));
        }
    }

    public function getById(ServerRequestInterface $request): Response
    {
        try {
            $id = $request->getAttribute('id');
            $account = $this->accountService->getById($id);

            if (!$account) {
                return new Response(404, ['Content-Type' => 'application/json'], json_encode([
                    'error' => 'Cuenta no encontrada'
                ]));
            }

            return new Response(200, ['Content-Type' => 'application/json'], json_encode([
                'success' => true,
                'data' => $account
            ]));
        } catch (\Throwable $e) {
            Logger::error("Error getting account: " . $e->getMessage());
            return new Response(500, ['Content-Type' => 'application/json'], json_encode([
                'error' => 'Error al obtener la cuenta'
            ]));
        }
    }

    public function close(ServerRequestInterface $request): Response
    {
        try {
            $id = $request->getAttribute('id');
            $result = $this->accountService->close($id);

            if (!$result) {
                return new Response(404, ['Content-Type' => 'application/json'], json_encode([
                    'error' => 'Cuenta no encontrada o ya está cerrada'
                ]));
            }

            return new Response(200, ['Content-Type' => 'application/json'], json_encode([
                'success' => true,
                'data' => ['status' => 'closed']
            ]));
        } catch (\Throwable $e) {
            Logger::error("Error closing account: " . $e->getMessage());
            return new Response(500, ['Content-Type' => 'application/json'], json_encode([
                'error' => 'Error al cerrar la cuenta'
            ]));
        }
    }
}
