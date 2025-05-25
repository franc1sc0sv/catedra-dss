<?php

namespace App\Controllers;

use App\Middlewares\RequestParser;
use App\Services\InsuranceService;
use App\Utils\Logger;
use Psr\Http\Message\ServerRequestInterface;
use React\Http\Message\Response;

class InsuranceController
{
    public function __construct(private InsuranceService $insuranceService) {}

    public function create(ServerRequestInterface $request): Response
    {
        try {
            $data = RequestParser::parse($request);
            $result = $this->insuranceService->create($data);

            return new Response(201, ['Content-Type' => 'application/json'], json_encode([
                'success' => true,
                'data' => $result
            ]));
        } catch (\RuntimeException $e) {
            return new Response(400, ['Content-Type' => 'application/json'], json_encode([
                'error' => $e->getMessage()
            ]));
        } catch (\Throwable $e) {
            Logger::error("Error creating insurance: " . $e->getMessage());
            return new Response(500, ['Content-Type' => 'application/json'], json_encode([
                'error' => 'Error al crear el seguro'
            ]));
        }
    }

    public function list(ServerRequestInterface $request): Response
    {
        try {
            $insurances = $this->insuranceService->list();
            return new Response(200, ['Content-Type' => 'application/json'], json_encode([
                'success' => true,
                'data' => $insurances
            ]));
        } catch (\Throwable $e) {
            Logger::error("Error listing insurances: " . $e->getMessage());
            return new Response(500, ['Content-Type' => 'application/json'], json_encode([
                'error' => 'Error al listar los seguros'
            ]));
        }
    }

    public function getById(ServerRequestInterface $request): Response
    {
        try {
            $id = $request->getAttribute('id');
            $insurance = $this->insuranceService->getById($id);

            if (!$insurance) {
                return new Response(404, ['Content-Type' => 'application/json'], json_encode([
                    'error' => 'Seguro no encontrado'
                ]));
            }

            return new Response(200, ['Content-Type' => 'application/json'], json_encode([
                'success' => true,
                'data' => $insurance
            ]));
        } catch (\Throwable $e) {
            Logger::error("Error getting insurance: " . $e->getMessage());
            return new Response(500, ['Content-Type' => 'application/json'], json_encode([
                'error' => 'Error al obtener el seguro'
            ]));
        }
    }

    public function close(ServerRequestInterface $request): Response
    {
        try {
            $id = $request->getAttribute('id');
            $result = $this->insuranceService->close($id);

            if (!$result) {
                return new Response(404, ['Content-Type' => 'application/json'], json_encode([
                    'error' => 'Seguro no encontrado o ya está cerrado'
                ]));
            }

            return new Response(200, ['Content-Type' => 'application/json'], json_encode([
                'success' => true,
                'data' => ['status' => 'closed']
            ]));
        } catch (\Throwable $e) {
            Logger::error("Error closing insurance: " . $e->getMessage());
            return new Response(500, ['Content-Type' => 'application/json'], json_encode([
                'error' => 'Error al cerrar el seguro'
            ]));
        }
    }
}
