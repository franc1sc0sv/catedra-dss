<?php

namespace App\Controllers;

use App\Middlewares\RequestParser;
use App\Services\ClientService;
use App\Utils\Logger;
use Psr\Http\Message\ServerRequestInterface;
use React\Http\Message\Response;

class ClientController
{
    public function __construct(private ClientService $clientService) {}

    public function create(ServerRequestInterface $request): Response
    {
        try {
            $data = RequestParser::parse($request);
            $result = $this->clientService->create($data);

            return new Response(201, ['Content-Type' => 'application/json'], json_encode([
                'success' => true,
                'data' => $result
            ]));
        } catch (\RuntimeException $e) {
            return new Response(400, ['Content-Type' => 'application/json'], json_encode([
                'error' => $e->getMessage()
            ]));
        } catch (\Throwable $e) {
            Logger::error("Error creating client: " . $e->getMessage());
            return new Response(500, ['Content-Type' => 'application/json'], json_encode([
                'error' => 'Error al crear el cliente'
            ]));
        }
    }

    public function list(ServerRequestInterface $request): Response
    {
        try {
            $clients = $this->clientService->list();
            return new Response(200, ['Content-Type' => 'application/json'], json_encode([
                'success' => true,
                'data' => $clients
            ]));
        } catch (\Throwable $e) {
            Logger::error("Error listing clients: " . $e->getMessage());
            return new Response(500, ['Content-Type' => 'application/json'], json_encode([
                'error' => 'Error al listar los clientes'
            ]));
        }
    }

    public function toggleStatus(ServerRequestInterface $request): Response
    {
        try {
            $userId = $request->getAttribute('userId');
            var_dump($userId);
            $result = $this->clientService->toggleStatus($userId);

            return new Response(200, ['Content-Type' => 'application/json'], json_encode([
                'success' => true,
                'data' => ['is_active' => $result]
            ]));
        } catch (\Throwable $e) {
            Logger::error("Error toggling client status: " . $e->getMessage());
            return new Response(500, ['Content-Type' => 'application/json'], json_encode([
                'error' => 'Error al cambiar el estado del cliente'
            ]));
        }
    }

    public function getById(ServerRequestInterface $request): Response
    {
        try {
            $id = $request->getAttribute('id');
            $client = $this->clientService->getById($id);

            if (!$client) {
                return new Response(404, ['Content-Type' => 'application/json'], json_encode([
                    'error' => 'Cliente no encontrado'
                ]));
            }

            return new Response(200, ['Content-Type' => 'application/json'], json_encode([
                'success' => true,
                'data' => $client
            ]));
        } catch (\Throwable $e) {
            Logger::error("Error getting client: " . $e->getMessage());
            return new Response(500, ['Content-Type' => 'application/json'], json_encode([
                'error' => 'Error al obtener el cliente'
            ]));
        }
    }
}
