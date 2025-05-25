<?php

namespace App\Middlewares;

use Psr\Http\Message\ServerRequestInterface;
use React\Http\Message\Response;

class AdminMiddleware
{
    public function handle(ServerRequestInterface $request, callable $next): Response
    {
        $user = $request->getAttribute('user');

        if (!$user || $user->role !== 'admin') {
            return new Response(403, ['Content-Type' => 'application/json'], json_encode([
                'error' => 'Acceso denegado. Se requieren privilegios de administrador.'
            ]));
        }

        return $next($request);
    }
}
