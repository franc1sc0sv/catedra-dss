<?php

namespace App\Controllers;

use App\Middlewares\RequestParser;
use App\Services\EmployeeService;
use App\Utils\Logger;
use Psr\Http\Message\ServerRequestInterface;
use React\Http\Message\Response;

class EmployeeController
{
    public function __construct(private EmployeeService $employeeService) {}

    public function create(ServerRequestInterface $request): Response
    {
        try {
            $data = RequestParser::parse($request);
            $result = $this->employeeService->create($data);

            return new Response(201, ['Content-Type' => 'application/json'], json_encode([
                'success' => true,
                'data' => $result
            ]));
        } catch (\RuntimeException $e) {
            return new Response(400, ['Content-Type' => 'application/json'], json_encode([
                'error' => $e->getMessage()
            ]));
        } catch (\Throwable $e) {
            Logger::error("Error creating employee: " . $e->getMessage());
            return new Response(500, ['Content-Type' => 'application/json'], json_encode([
                'error' => 'Error al crear el empleado'
            ]));
        }
    }

    public function list(ServerRequestInterface $request): Response
    {
        try {
            $employees = $this->employeeService->list();
            return new Response(200, ['Content-Type' => 'application/json'], json_encode([
                'success' => true,
                'data' => $employees
            ]));
        } catch (\Throwable $e) {
            Logger::error("Error listing employees: " . $e->getMessage());
            return new Response(500, ['Content-Type' => 'application/json'], json_encode([
                'error' => 'Error al listar los empleados'
            ]));
        }
    }

    public function toggleStatus(ServerRequestInterface $request): Response
    {
        try {
            $userId = $request->getAttribute('userId');
            $result = $this->employeeService->toggleStatus($userId);

            return new Response(200, ['Content-Type' => 'application/json'], json_encode([
                'success' => true,
                'data' => ['is_active' => $result]
            ]));
        } catch (\Throwable $e) {
            Logger::error("Error toggling employee status: " . $e->getMessage());
            return new Response(500, ['Content-Type' => 'application/json'], json_encode([
                'error' => 'Error al cambiar el estado del empleado'
            ]));
        }
    }

    public function getById(ServerRequestInterface $request): Response
    {
        try {
            $id = $request->getAttribute('id');
            $employee = $this->employeeService->getById($id);

            if (!$employee) {
                return new Response(404, ['Content-Type' => 'application/json'], json_encode([
                    'error' => 'Empleado no encontrado'
                ]));
            }

            return new Response(200, ['Content-Type' => 'application/json'], json_encode([
                'success' => true,
                'data' => $employee
            ]));
        } catch (\Throwable $e) {
            Logger::error("Error getting employee: " . $e->getMessage());
            return new Response(500, ['Content-Type' => 'application/json'], json_encode([
                'error' => 'Error al obtener el empleado'
            ]));
        }
    }
}
