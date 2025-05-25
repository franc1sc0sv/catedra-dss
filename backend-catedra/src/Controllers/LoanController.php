<?php

namespace App\Controllers;

use App\Middlewares\RequestParser;
use App\Services\LoanService;
use App\Utils\Logger;
use Psr\Http\Message\ServerRequestInterface;
use React\Http\Message\Response;

class LoanController
{
    public function __construct(private LoanService $loanService) {}

    public function create(ServerRequestInterface $request): Response
    {
        try {
            $data = RequestParser::parse($request);
            $result = $this->loanService->create($data);

            return new Response(201, ['Content-Type' => 'application/json'], json_encode([
                'success' => true,
                'data' => $result
            ]));
        } catch (\RuntimeException $e) {
            return new Response(400, ['Content-Type' => 'application/json'], json_encode([
                'error' => $e->getMessage()
            ]));
        } catch (\Throwable $e) {
            Logger::error("Error creating loan: " . $e->getMessage());
            return new Response(500, ['Content-Type' => 'application/json'], json_encode([
                'error' => 'Error al crear el préstamo'
            ]));
        }
    }

    public function list(ServerRequestInterface $request): Response
    {
        try {
            $loans = $this->loanService->list();
            return new Response(200, ['Content-Type' => 'application/json'], json_encode([
                'success' => true,
                'data' => $loans
            ]));
        } catch (\Throwable $e) {
            Logger::error("Error listing loans: " . $e->getMessage());
            return new Response(500, ['Content-Type' => 'application/json'], json_encode([
                'error' => 'Error al listar los préstamos'
            ]));
        }
    }

    public function getById(ServerRequestInterface $request): Response
    {
        try {
            $id = $request->getAttribute('id');
            $loan = $this->loanService->getById($id);

            if (!$loan) {
                return new Response(404, ['Content-Type' => 'application/json'], json_encode([
                    'error' => 'Préstamo no encontrado'
                ]));
            }

            return new Response(200, ['Content-Type' => 'application/json'], json_encode([
                'success' => true,
                'data' => $loan
            ]));
        } catch (\Throwable $e) {
            Logger::error("Error getting loan: " . $e->getMessage());
            return new Response(500, ['Content-Type' => 'application/json'], json_encode([
                'error' => 'Error al obtener el préstamo'
            ]));
        }
    }

    public function close(ServerRequestInterface $request): Response
    {
        try {
            $id = $request->getAttribute('id');
            $result = $this->loanService->close($id);

            if (!$result) {
                return new Response(404, ['Content-Type' => 'application/json'], json_encode([
                    'error' => 'Préstamo no encontrado o ya está cerrado'
                ]));
            }

            return new Response(200, ['Content-Type' => 'application/json'], json_encode([
                'success' => true,
                'data' => ['status' => 'closed']
            ]));
        } catch (\Throwable $e) {
            Logger::error("Error closing loan: " . $e->getMessage());
            return new Response(500, ['Content-Type' => 'application/json'], json_encode([
                'error' => 'Error al cerrar el préstamo'
            ]));
        }
    }
}
