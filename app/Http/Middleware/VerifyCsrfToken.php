<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * Las rutas que deben ser excluidas de la verificación CSRF.
     *
     * @var array<int, string>
     */
    protected $except = [
        'api/mobile/*',
        'api/*', // Exime todas las rutas que empiecen con /api/
        'sanctum/csrf-cookie',
        'api/login',
        'api/register',
        'api/logout',
    ];
}
