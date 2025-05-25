<?php

namespace App\Middlewares;

use Psr\Http\Message\ServerRequestInterface;
use React\Http\Message\Response;

class RoleMiddleware
{
    public function __construct(private array $allowedRoles) {}

    public function handle(ServerRequestInterface $request, callable $next): Response
    {
        $user = $request->getAttribute('user');

        if (!$user || !in_array($user->role, $this->allowedRoles)) {
            return new Response(403, ['Content-Type' => 'application/json'], json_encode([
                'error' => 'Acceso denegado. No tiene los permisos necesarios para acceder a este recurso.'
            ]));
        }

        return $next($request);
    }
}
