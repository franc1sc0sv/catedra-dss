<?php

namespace App\Middlewares;

use App\Services\AuthService;
use App\Utils\Logger;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Psr\Http\Message\ServerRequestInterface;
use React\Http\Message\Response;

class JwtMiddleware
{
    //dependencia de servicio 
    public function __construct(private AuthService $authService) {}

    public function handle(ServerRequestInterface $request, callable $next): Response
    {
        $headers = $request->getHeader('Authorization');
        $token = $headers[0] ?? null;


        if (!$token) {
            return $this->unauthorized('Token no encontrado');
        }

        $token = str_replace('Bearer ', '', $token);

        try {
            $decoded = JWT::decode($token, new Key($this->authService->getSecret(), 'HS256'));
            $request = $request->withAttribute('user', $decoded);
            return $next($request);
        } catch (\Throwable $e) {
            Logger::debug("error: " . $e->getMessage());
            return $this->unauthorized('Token inválido o expirado');
        }
    }

    private function unauthorized(string $message): Response
    {
        return new Response(401, ['Content-Type' => 'application/json'], json_encode([
            'error' => $message,
        ]));
    }
}
