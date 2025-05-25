<?php

namespace App\Controllers;

use App\Services\AdminService;
use App\Utils\Logger;
use Psr\Http\Message\ServerRequestInterface;
use React\Http\Message\Response;

class AdminController
{
    public function __construct(private AdminService $adminService) {}

    public function getDashboardSummary(ServerRequestInterface $request): Response
    {
        try {
            $summary = $this->adminService->getDashboardSummary();
            return new Response(200, ['Content-Type' => 'application/json'], json_encode([
                'success' => true,
                'data' => $summary
            ]));
        } catch (\Throwable $e) {
            Logger::error("Error getting dashboard summary: " . $e->getMessage());
            return new Response(500, ['Content-Type' => 'application/json'], json_encode([
                'error' => 'Error al obtener el resumen del dashboard'
            ]));
        }
    }
}
