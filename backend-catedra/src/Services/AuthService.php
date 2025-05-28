<?php

namespace App\Services;

use App\Utils\Logger;
use PDO;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Respect\Validation\Validator as v;

class AuthService
{
    public function __construct(private PDO $pdo, private string $jwtSecret) {}

    public function login(array $data): string|array
    {
        try {
            $validation = $this->validateLogin($data);
            if ($validation !== true) return $validation;

            $stmt = $this->pdo->prepare("SELECT * FROM users WHERE username = ?");
            $stmt->execute([$data['username']]);
            $user = $stmt->fetch();

            if (!$user || !password_verify($data['password'], $user['password_hash'])) {
                return ['error' => 'Usuario o contraseña son incorrectos.'];
            }

            if (!$user['is_active']) {
                return ['error' => 'Usuario inactivo.'];
            }

            $payload = [
                'id' => $user['id'],
                'username' => $user['username'],
                'role' => $user['role'],
                'iat' => time(),
                'exp' => time() + (int)$_ENV['JWT_EXPIRATION'],
            ];

            return JWT::encode($payload, $this->jwtSecret, 'HS256');
        } catch (\Throwable $e) {
            Logger::error("Error al iniciar sesión: " . $e->getMessage());
            return ['error' => "Error al iniciar sesión: " . $e->getMessage()];
        }
    }

    public function getProfileByUserId(string $userId): array
    {
        try {
            $stmt = $this->pdo->prepare("SELECT * FROM users WHERE id = ?");
            $stmt->execute([$userId]);
            return $stmt->fetch();
        } catch (\Throwable $e) {
            Logger::error("Error al obtener perfil por token: " . $e->getMessage());
            return [];
        }
    }


    private function validateLogin(array $data): true|array
    {
        try {
            $validator = v::key('username', v::stringType()->notEmpty())
                ->key('password', v::stringType()->notEmpty());

            return $validator->validate($data) ? true : ['error' => 'Usuario o contraseña inválidos.'];
        } catch (\Throwable $e) {
            Logger::error("Error al validar login: " . $e->getMessage());
            return ['error' => "Error al validar login: " . $e->getMessage()];
        }
    }

    public function getSecret(): string
    {
        return $this->jwtSecret;
    }
}
