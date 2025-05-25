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
use App\Controllers\AccountController;
use App\Controllers\CardController;
use App\Controllers\InsuranceController;
use App\Controllers\LoanController;
use App\Services\AccountService;
use App\Services\CardService;
use App\Services\InsuranceService;
use App\Services\LoanService;

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

        $authService = new AuthService($pdo, $jwtSecret);
        $this->jwtMiddleware = new JwtMiddleware($authService);
        $this->adminRoleMiddleware = new RoleMiddleware(['admin']);
        $this->employeeRoleMiddleware = new RoleMiddleware(['employee']);
        $this->adminEmployeeRoleMiddleware = new RoleMiddleware(['admin', 'employee']);
    }

    public function handle(ServerRequestInterface $request): Response
    {
        $path = $request->getUri()->getPath();
        $method = $request->getMethod();

        // Rutas de autenticación
        if ($path === '/api/auth/login' && $method === 'POST') {
            $authService = new AuthService($this->db->getConnection(), $_ENV['JWT_SECRET']);
            $controller = new AuthController($authService);
            return $controller->login($request);
        }

        if ($path === '/api/auth/profile' && $method === 'GET') {
            $authService = new AuthService($this->db->getConnection(), $_ENV['JWT_SECRET']);
            $controller = new AuthController($authService);
            return $this->jwtMiddleware->handle($request, fn($req) => $controller->getProfileByUserId($req));
        }

        // Rutas de administrador
        if ($path === '/api/admin/dashboard' && $method === 'GET') {
            $adminService = new AdminService($this->db->getConnection());
            $controller = new AdminController($adminService);
            return $this->jwtMiddleware->handle(
                $request,
                fn($req) => $this->adminRoleMiddleware->handle($req, fn($r) => $controller->getDashboardSummary($r))
            );
        }

        // Rutas de empleados
        if ($path === '/api/employees' && $method === 'POST') {
            $employeeService = new EmployeeService($this->db->getConnection());
            $controller = new EmployeeController($employeeService);
            return $this->jwtMiddleware->handle(
                $request,
                fn($req) => $this->adminRoleMiddleware->handle($req, fn($r) => $controller->create($r))
            );
        }

        if ($path === '/api/employees' && $method === 'GET') {
            $employeeService = new EmployeeService($this->db->getConnection());
            $controller = new EmployeeController($employeeService);
            return $this->jwtMiddleware->handle(
                $request,
                fn($req) => $this->adminRoleMiddleware->handle($req, fn($r) => $controller->list($r))
            );
        }

        if (preg_match('/^\/api\/employees\/([^\/]+)$/', $path, $matches) && $method === 'GET') {
            $employeeService = new EmployeeService($this->db->getConnection());
            $controller = new EmployeeController($employeeService);
            return $this->jwtMiddleware->handle(
                $request,
                fn($req) => $this->adminRoleMiddleware->handle($req, fn($r) => $controller->getById($r))
            );
        }

        if (preg_match('/^\/api\/employees\/([^\/]+)\/toggle-status$/', $path, $matches) && $method === 'PUT') {
            $employeeService = new EmployeeService($this->db->getConnection());
            $controller = new EmployeeController($employeeService);
            return $this->jwtMiddleware->handle(
                $request,
                fn($req) => $this->adminRoleMiddleware->handle($req, fn($r) => $controller->toggleStatus($r))
            );
        }

        // Rutas de clientes
        if ($path === '/api/clients' && $method === 'POST') {
            $clientService = new ClientService($this->db->getConnection());
            $controller = new ClientController($clientService);
            return $this->jwtMiddleware->handle(
                $request,
                fn($req) => $this->adminEmployeeRoleMiddleware->handle($req, fn($r) => $controller->create($r))
            );
        }

        if ($path === '/api/clients' && $method === 'GET') {
            $clientService = new ClientService($this->db->getConnection());
            $controller = new ClientController($clientService);
            return $this->jwtMiddleware->handle(
                $request,
                fn($req) => $this->adminEmployeeRoleMiddleware->handle($req, fn($r) => $controller->list($r))
            );
        }

        if (preg_match('/^\/api\/clients\/([^\/]+)$/', $path, $matches) && $method === 'GET') {
            $clientService = new ClientService($this->db->getConnection());
            $controller = new ClientController($clientService);
            return $this->jwtMiddleware->handle(
                $request,
                fn($req) => $this->adminEmployeeRoleMiddleware->handle($req, fn($r) => $controller->getById($r))
            );
        }

        if (preg_match('/^\/api\/clients\/([^\/]+)\/toggle-status$/', $path, $matches) && $method === 'PUT') {
            $clientService = new ClientService($this->db->getConnection());
            $controller = new ClientController($clientService);
            return $this->jwtMiddleware->handle(
                $request,
                fn($req) => $this->adminEmployeeRoleMiddleware->handle($req, fn($r) => $controller->toggleStatus($r))
            );
        }

        // Rutas de cuentas
        if ($path === '/api/accounts' && $method === 'POST') {
            $accountService = new AccountService($this->db->getConnection());
            $controller = new AccountController($accountService);
            return $this->jwtMiddleware->handle(
                $request,
                fn($req) => $this->adminEmployeeRoleMiddleware->handle($req, fn($r) => $controller->create($r))
            );
        }

        if ($path === '/api/accounts' && $method === 'GET') {
            $accountService = new AccountService($this->db->getConnection());
            $controller = new AccountController($accountService);
            return $this->jwtMiddleware->handle(
                $request,
                fn($req) => $this->adminEmployeeRoleMiddleware->handle($req, fn($r) => $controller->list($r))
            );
        }

        if (preg_match('/^\/api\/accounts\/([^\/]+)$/', $path, $matches) && $method === 'GET') {
            $accountService = new AccountService($this->db->getConnection());
            $controller = new AccountController($accountService);
            return $this->jwtMiddleware->handle(
                $request,
                fn($req) => $this->adminEmployeeRoleMiddleware->handle($req, fn($r) => $controller->getById($r))
            );
        }

        if (preg_match('/^\/api\/accounts\/([^\/]+)\/close$/', $path, $matches) && $method === 'PUT') {
            $accountService = new AccountService($this->db->getConnection());
            $controller = new AccountController($accountService);
            return $this->jwtMiddleware->handle(
                $request,
                fn($req) => $this->adminEmployeeRoleMiddleware->handle($req, fn($r) => $controller->close($r))
            );
        }

        // Rutas de tarjetas
        if ($path === '/api/cards' && $method === 'POST') {
            $cardService = new CardService($this->db->getConnection());
            $controller = new CardController($cardService);
            return $this->jwtMiddleware->handle(
                $request,
                fn($req) => $this->adminEmployeeRoleMiddleware->handle($req, fn($r) => $controller->create($r))
            );
        }

        if ($path === '/api/cards' && $method === 'GET') {
            $cardService = new CardService($this->db->getConnection());
            $controller = new CardController($cardService);
            return $this->jwtMiddleware->handle(
                $request,
                fn($req) => $this->adminEmployeeRoleMiddleware->handle($req, fn($r) => $controller->list($r))
            );
        }

        if (preg_match('/^\/api\/cards\/([^\/]+)$/', $path, $matches) && $method === 'GET') {
            $cardService = new CardService($this->db->getConnection());
            $controller = new CardController($cardService);
            return $this->jwtMiddleware->handle(
                $request,
                fn($req) => $this->adminEmployeeRoleMiddleware->handle($req, fn($r) => $controller->getById($r))
            );
        }

        if (preg_match('/^\/api\/cards\/([^\/]+)\/close$/', $path, $matches) && $method === 'PUT') {
            $cardService = new CardService($this->db->getConnection());
            $controller = new CardController($cardService);
            return $this->jwtMiddleware->handle(
                $request,
                fn($req) => $this->adminEmployeeRoleMiddleware->handle($req, fn($r) => $controller->close($r))
            );
        }

        // Rutas de préstamos
        if ($path === '/api/loans' && $method === 'POST') {
            $loanService = new LoanService($this->db->getConnection());
            $controller = new LoanController($loanService);
            return $this->jwtMiddleware->handle(
                $request,
                fn($req) => $this->adminEmployeeRoleMiddleware->handle($req, fn($r) => $controller->create($r))
            );
        }

        if ($path === '/api/loans' && $method === 'GET') {
            $loanService = new LoanService($this->db->getConnection());
            $controller = new LoanController($loanService);
            return $this->jwtMiddleware->handle(
                $request,
                fn($req) => $this->adminEmployeeRoleMiddleware->handle($req, fn($r) => $controller->list($r))
            );
        }

        if (preg_match('/^\/api\/loans\/([^\/]+)$/', $path, $matches) && $method === 'GET') {
            $loanService = new LoanService($this->db->getConnection());
            $controller = new LoanController($loanService);
            return $this->jwtMiddleware->handle(
                $request,
                fn($req) => $this->adminEmployeeRoleMiddleware->handle($req, fn($r) => $controller->getById($r))
            );
        }

        if (preg_match('/^\/api\/loans\/([^\/]+)\/close$/', $path, $matches) && $method === 'PUT') {
            $loanService = new LoanService($this->db->getConnection());
            $controller = new LoanController($loanService);
            return $this->jwtMiddleware->handle(
                $request,
                fn($req) => $this->adminEmployeeRoleMiddleware->handle($req, fn($r) => $controller->close($r))
            );
        }

        // Rutas de seguros
        if ($path === '/api/insurances' && $method === 'POST') {
            $insuranceService = new InsuranceService($this->db->getConnection());
            $controller = new InsuranceController($insuranceService);
            return $this->jwtMiddleware->handle(
                $request,
                fn($req) => $this->adminEmployeeRoleMiddleware->handle($req, fn($r) => $controller->create($r))
            );
        }

        if ($path === '/api/insurances' && $method === 'GET') {
            $insuranceService = new InsuranceService($this->db->getConnection());
            $controller = new InsuranceController($insuranceService);
            return $this->jwtMiddleware->handle(
                $request,
                fn($req) => $this->adminEmployeeRoleMiddleware->handle($req, fn($r) => $controller->list($r))
            );
        }

        if (preg_match('/^\/api\/insurances\/([^\/]+)$/', $path, $matches) && $method === 'GET') {
            $insuranceService = new InsuranceService($this->db->getConnection());
            $controller = new InsuranceController($insuranceService);
            return $this->jwtMiddleware->handle(
                $request,
                fn($req) => $this->adminEmployeeRoleMiddleware->handle($req, fn($r) => $controller->getById($r))
            );
        }

        if (preg_match('/^\/api\/insurances\/([^\/]+)\/close$/', $path, $matches) && $method === 'PUT') {
            $insuranceService = new InsuranceService($this->db->getConnection());
            $controller = new InsuranceController($insuranceService);
            return $this->jwtMiddleware->handle(
                $request,
                fn($req) => $this->adminEmployeeRoleMiddleware->handle($req, fn($r) => $controller->close($r))
            );
        }

        // Ruta por defecto
        return new Response(404, ['Content-Type' => 'application/json'], json_encode([
            'error' => 'Ruta no encontrada'
        ]));
    }
}
