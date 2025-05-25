<?php

namespace App;

use React\Http\Message\Response;
use Psr\Http\Message\ServerRequestInterface;
use App\Controllers\HomeController;
use App\Controllers\DataController;
use App\Services\DatabaseService;
use App\Controllers\AuthController;
use App\Controllers\DocumentController;
use App\Controllers\EventController;
use App\Controllers\AdminController;
use App\Controllers\EmployeeController;
use App\Controllers\ClientController;
use App\Middlewares\JwtMiddleware;
use App\Middlewares\RoleMiddleware;
use App\Services\AuthService;
use App\Services\AdminService;
use App\Services\EmployeeService;
use App\Services\DocumentService;
use App\Services\ClientService;
use App\Utils\Logger;

use function App\Middlewares\withParsedBody;

class Router
{
    private JwtMiddleware $jwtMiddleware;
    private RoleMiddleware $adminRoleMiddleware;
    private RoleMiddleware $employeeRoleMiddleware;
    private RoleMiddleware $adminEmployeeRoleMiddleware;
    private DatabaseService $db;

    public function __construct()
    {
        $this->db = new DatabaseService();
        $pdo = $this->db->getConnection();
        $jwtSecret = $_ENV['JWT_SECRET'];

        $this->jwtMiddleware = new JwtMiddleware(new AuthService($pdo, $jwtSecret));
        $this->adminRoleMiddleware = new RoleMiddleware(['admin']);
        $this->employeeRoleMiddleware = new RoleMiddleware(['employee']);
        $this->adminEmployeeRoleMiddleware = new RoleMiddleware(['admin', 'employee']);
    }

    public function handle(ServerRequestInterface $request): Response
    {
        $path = $request->getUri()->getPath();
        $method = $request->getMethod();
        $pdo = $this->db->getConnection();
        $jwtSecret = $_ENV['JWT_SECRET'];

        // Auth routes
        if ($path === '/api/auth/login' && $method === 'POST') {
            $authService = new AuthService($pdo, $jwtSecret);
            $authController = new AuthController($authService);
            return $authController->login($request);
        }

        if ($path === '/api/auth/profile' && $method === 'GET') {
            $authService = new AuthService($pdo, $jwtSecret);
            $authController = new AuthController($authService);
            return $this->jwtMiddleware->handle($request, fn($request) => $authController->getProfileByUserId($request));
        }

        // Admin routes
        if ($path === '/api/admin/dashboard' && $method === 'GET') {
            $adminService = new AdminService($pdo);
            $adminController = new AdminController($adminService);
            return $this->jwtMiddleware->handle(
                $request,
                fn($request) => $this->adminRoleMiddleware->handle($request, fn($request) => $adminController->getDashboardSummary($request))
            );
        }

        // Employee routes
        if ($path === '/api/employees' && $method === 'POST') {
            $employeeService = new EmployeeService($pdo);
            $employeeController = new EmployeeController($employeeService);
            return $this->jwtMiddleware->handle(
                $request,
                fn($request) => $this->adminRoleMiddleware->handle($request, fn($request) => $employeeController->create($request))
            );
        }

        if ($path === '/api/employees' && $method === 'GET') {
            $employeeService = new EmployeeService($pdo);
            $employeeController = new EmployeeController($employeeService);
            return $this->jwtMiddleware->handle(
                $request,
                fn($request) => $this->adminEmployeeRoleMiddleware->handle($request, fn($request) => $employeeController->list($request))
            );
        }

        if (preg_match('/^\/api\/employees\/([^\/]+)$/', $path, $matches) && $method === 'GET') {
            $employeeService = new EmployeeService($pdo);
            $employeeController = new EmployeeController($employeeService);
            $request = $request->withAttribute('id', $matches[1]);
            return $this->jwtMiddleware->handle(
                $request,
                fn($request) => $this->adminEmployeeRoleMiddleware->handle($request, fn($request) => $employeeController->getById($request))
            );
        }

        if (preg_match('/^\/api\/employees\/([^\/]+)\/toggle-status$/', $path, $matches) && $method === 'PUT') {
            $employeeService = new EmployeeService($pdo);
            $employeeController = new EmployeeController($employeeService);
            $request = $request->withAttribute('userId', $matches[1]);
            return $this->jwtMiddleware->handle(
                $request,
                fn($request) => $this->adminRoleMiddleware->handle($request, fn($request) => $employeeController->toggleStatus($request))
            );
        }

        // Client routes
        if ($path === '/api/clients' && $method === 'POST') {
            $clientService = new ClientService($pdo);
            $clientController = new ClientController($clientService);
            return $this->jwtMiddleware->handle(
                $request,
                fn($request) => $this->adminEmployeeRoleMiddleware->handle($request, fn($request) => $clientController->create($request))
            );
        }

        if ($path === '/api/clients' && $method === 'GET') {
            $clientService = new ClientService($pdo);
            $clientController = new ClientController($clientService);
            return $this->jwtMiddleware->handle(
                $request,
                fn($request) => $this->adminEmployeeRoleMiddleware->handle($request, fn($request) => $clientController->list($request))
            );
        }

        if (preg_match('/^\/api\/clients\/([^\/]+)$/', $path, $matches) && $method === 'GET') {
            $clientService = new ClientService($pdo);
            $clientController = new ClientController($clientService);
            $request = $request->withAttribute('id', $matches[1]);
            return $this->jwtMiddleware->handle(
                $request,
                fn($request) => $this->adminEmployeeRoleMiddleware->handle($request, fn($request) => $clientController->getById($request))
            );
        }

        if (preg_match('/^\/api\/clients\/([^\/]+)\/toggle-status$/', $path, $matches) && $method === 'PUT') {
            $clientService = new ClientService($pdo);
            $clientController = new ClientController($clientService);
            $request = $request->withAttribute('userId', $matches[1]);
            return $this->jwtMiddleware->handle(
                $request,
                fn($request) => $this->adminRoleMiddleware->handle($request, fn($request) => $clientController->toggleStatus($request))
            );
        }

        // Default response for unrecognized routes
        return new Response(404, ['Content-Type' => 'application/json'], json_encode([
            'error' => 'Ruta no encontrada'
        ]));
    }
}
