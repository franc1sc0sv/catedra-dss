<?php

namespace App\Controllers;

use App\Middlewares\RequestParser;
use App\Utils\Logger;
use React\Http\Message\Response;
use Psr\Http\Message\ServerRequestInterface;
use App\Services\AuthService;

class AuthController
{
    public function __construct(private AuthService $authService) {}


    public function login(ServerRequestInterface $request): Response
    {
        try {
            $data = RequestParser::parse(request: $request);

            $result = $this->authService->login($data);


            if (is_array($result) && isset($result['error'])) {
                return new Response(401, ['Content-Type' => 'application/json'], json_encode(['error' => $result['error']]));
            }

            return new Response(200, [
                'Content-Type' => 'application/json',
                'Set-Cookie' => "token={$result}; HttpOnly; Path=/;",
            ], json_encode(['success' => true, 'token' => $result]));
        } catch (\Throwable $e) {
            Logger::error("Error al iniciar sesión: " . $e->getMessage());
            return new Response(500, ['Content-Type' => 'application/json'], json_encode(['error' => ['message' => 'Error interno del servidor']]));
        }
    }

    public function getProfileByUserId(ServerRequestInterface $request): Response
    {
        try {
            $user = $request->getAttribute('user');
            $userId = $user->id;

            $result = $this->authService->getProfileByUserId($userId);

            return new Response(200, ['Content-Type' => 'application/json'], json_encode(['success' => true, 'user' => $result]));
        } catch (\Throwable $e) {
            Logger::error("Error al obtener perfil por token: " . $e->getMessage());
            return new Response(500, ['Content-Type' => 'application/json'], json_encode(['error' => 'Error interno del servidor']));
        }
    }
}
