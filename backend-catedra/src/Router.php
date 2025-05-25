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
use App\Middlewares\JwtMiddleware as MiddlewaresJwtMiddleware;
use App\Services\AuthService;
use App\Services\DocumentService;
use App\Utils\Logger;
use Middlewares\JwtMiddleware;

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

        // Controllers
        $authController = new AuthController($authService);
        $eventController = new EventController();

        // Middlewares
        $jwtMiddleware = new MiddlewaresJwtMiddleware($authService);


        return match (true) {

            // API routes
            $path === '/api/login' && $method === 'POST' => $authController->login($request),

            $path === '/api/logout' && $method === 'POST' => $jwtMiddleware->handle($request, fn($req) => $authController->logout()),
            $path === '/api/profile' && $method === 'GET' => $jwtMiddleware->handle($request, fn($req) => $authController->getProfileByUserId($req)),

            $path === '/api/events' && $method === 'GET' => $eventController->stream(),

            default => new Response(
                404,
                ['Content-Type' => 'text/plain'],
                "404 - Ruta no encontrada"
            ),
        };
    }
}
