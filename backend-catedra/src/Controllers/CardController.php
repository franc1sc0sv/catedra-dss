<?php

namespace App\Controllers;

use App\Middlewares\RequestParser;
use App\Services\CardService;
use App\Utils\Logger;
use Psr\Http\Message\ServerRequestInterface;
use React\Http\Message\Response;

class CardController
{
    public function __construct(private CardService $cardService) {}

    public function create(ServerRequestInterface $request): Response
    {
        try {
            $data = RequestParser::parse($request);
            $result = $this->cardService->create($data);

            return new Response(201, ['Content-Type' => 'application/json'], json_encode([
                'success' => true,
                'data' => $result
            ]));
        } catch (\RuntimeException $e) {
            return new Response(400, ['Content-Type' => 'application/json'], json_encode([
                'error' => $e->getMessage()
            ]));
        } catch (\Throwable $e) {
            Logger::error("Error creating card: " . $e->getMessage());
            return new Response(500, ['Content-Type' => 'application/json'], json_encode([
                'error' => 'Error al crear la tarjeta'
            ]));
        }
    }

    public function list(ServerRequestInterface $request): Response
    {
        try {
            $cards = $this->cardService->list();
            return new Response(200, ['Content-Type' => 'application/json'], json_encode([
                'success' => true,
                'data' => $cards
            ]));
        } catch (\Throwable $e) {
            Logger::error("Error listing cards: " . $e->getMessage());
            return new Response(500, ['Content-Type' => 'application/json'], json_encode([
                'error' => 'Error al listar las tarjetas'
            ]));
        }
    }

    public function getById(ServerRequestInterface $request): Response
    {
        try {
            $id = $request->getAttribute('id');
            $card = $this->cardService->getById($id);

            if (!$card) {
                return new Response(404, ['Content-Type' => 'application/json'], json_encode([
                    'error' => 'Tarjeta no encontrada'
                ]));
            }

            return new Response(200, ['Content-Type' => 'application/json'], json_encode([
                'success' => true,
                'data' => $card
            ]));
        } catch (\Throwable $e) {
            Logger::error("Error getting card: " . $e->getMessage());
            return new Response(500, ['Content-Type' => 'application/json'], json_encode([
                'error' => 'Error al obtener la tarjeta'
            ]));
        }
    }

    public function close(ServerRequestInterface $request): Response
    {
        try {
            $id = $request->getAttribute('id');
            $result = $this->cardService->close($id);

            if (!$result) {
                return new Response(404, ['Content-Type' => 'application/json'], json_encode([
                    'error' => 'Tarjeta no encontrada o ya está cerrada'
                ]));
            }

            return new Response(200, ['Content-Type' => 'application/json'], json_encode([
                'success' => true,
                'data' => ['status' => 'closed']
            ]));
        } catch (\Throwable $e) {
            Logger::error("Error closing card: " . $e->getMessage());
            return new Response(500, ['Content-Type' => 'application/json'], json_encode([
                'error' => 'Error al cerrar la tarjeta'
            ]));
        }
    }
}
