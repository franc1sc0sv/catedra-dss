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
use App\Middlewares\JwtMiddleware;
use App\Middlewares\RoleMiddleware;
use App\Services\AuthService;
use App\Services\AdminService;
use App\Services\EmployeeService;
use App\Services\DocumentService;
use App\Utils\Logger;

use function App\Middlewares\withParsedBody;

class Router
{
    public static function handle(ServerRequestInterface $request): Response
    {
        $path = $request->getUri()->getPath();
        $method = $request->getMethod();

        // DB
        $db = new DatabaseService();
        $pdo = $db->getConnection();

        // JWT
        $jwtSecret = $_ENV['JWT_SECRET'];

        // Services
        $authService = new AuthService($pdo, $jwtSecret);
        $adminService = new AdminService($pdo);
        $employeeService = new EmployeeService($pdo);

        // Controllers
        $authController = new AuthController($authService);
        $eventController = new EventController();
        $adminController = new AdminController($adminService);
        $employeeController = new EmployeeController($employeeService);

        // Middlewares
        $jwtMiddleware = new JwtMiddleware($authService);
        $adminRoleMiddleware = new RoleMiddleware(['admin']);

        return match (true) {
            // Auth routes
            $path === '/api/login' && $method === 'POST' => $authController->login($request),
            $path === '/api/logout' && $method === 'POST' => $jwtMiddleware->handle($request, fn($req) => $authController->logout()),
            $path === '/api/profile' && $method === 'GET' => $jwtMiddleware->handle($request, fn($req) => $authController->getProfileByUserId($req)),

            // Admin routes
            $path === '/api/admin/dashboard' && $method === 'GET' =>
            $jwtMiddleware->handle(
                $request,
                fn($req) =>
                $adminRoleMiddleware->handle(
                    $req,
                    fn($r) =>
                    $adminController->getDashboardSummary($r)
                )
            ),

            $path === '/api/admin/employees' && $method === 'POST' =>
            $jwtMiddleware->handle(
                $request,
                fn($req) =>
                $adminRoleMiddleware->handle(
                    $req,
                    fn($r) =>
                    $employeeController->create($r)
                )
            ),

            $path === '/api/admin/employees' && $method === 'GET' =>
            $jwtMiddleware->handle(
                $request,
                fn($req) =>
                $adminRoleMiddleware->handle(
                    $req,
                    fn($r) =>
                    $employeeController->list($r)
                )
            ),

            $path === '/api/admin/employees/{id}' && $method === 'GET' =>
            $jwtMiddleware->handle(
                $request,
                fn($req) =>
                $adminRoleMiddleware->handle(
                    $req,
                    fn($r) =>
                    $employeeController->getById($r)
                )
            ),

            $path === '/api/admin/employees/{userId}/toggle-status' && $method === 'PUT' =>
            $jwtMiddleware->handle(
                $request,
                fn($req) =>
                $adminRoleMiddleware->handle(
                    $req,
                    fn($r) =>
                    $employeeController->toggleStatus($r)
                )
            ),


            default => new Response(
                404,
                ['Content-Type' => 'text/plain'],
                "404 - Ruta no encontrada"
            ),
        };
    }
}
