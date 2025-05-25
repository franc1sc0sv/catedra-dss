<?php

require __DIR__ . '/../vendor/autoload.php';

use React\EventLoop\Loop;
use React\Socket\SocketServer;
use React\Http\HttpServer;
use React\Http\Message\Response;
use Psr\Http\Message\ServerRequestInterface;
use App\Router;
use App\Seeds\UserSeeder;
use App\Services\DatabaseService;
use Dotenv\Dotenv;
use React\Http\Middleware\LimitConcurrentRequestsMiddleware;
use React\Http\Middleware\RequestBodyBufferMiddleware;
use React\Http\Middleware\RequestBodyParserMiddleware;
use React\Http\Middleware\StreamingRequestMiddleware;

$loop = Loop::get();

$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

$db = new DatabaseService();
$userSeeder = new UserSeeder($db);
$userSeeder->seed();

$http = new HttpServer(
    new StreamingRequestMiddleware(),
    new LimitConcurrentRequestsMiddleware(100),
    new RequestBodyBufferMiddleware(sizeLimit: 25 * 1024 * 1024),
    new RequestBodyParserMiddleware(100 * 1024 * 1024, 1),
    function (ServerRequestInterface $request) {
        // Manejar solicitud preflight OPTIONS
        if ($request->getMethod() === 'OPTIONS') {
            return new Response(
                200,
                [
                    'Access-Control-Allow-Origin' => 'http://localhost:5173',
                    'Access-Control-Allow-Methods' => 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers' => 'Content-Type, Authorization, Accept',
                    'Access-Control-Allow-Credentials' => 'true',
                ],
                ''
            );
        }

        // Procesar normalmente otras solicitudes
        $response = Router::handle($request);

        return $response->withHeader('Access-Control-Allow-Origin', 'http://localhost:5173')
            ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept')
            ->withHeader('Access-Control-Allow-Credentials', 'true');
    }
);

$socket = new SocketServer("0.0.0.0:8000", [], $loop);
$http->listen($socket);

echo 'Listening on ' . str_replace('tcp:', 'http:', $socket->getAddress()) . PHP_EOL;
