<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
    /**
     * The application's global HTTP middleware stack.
     *
     * @var array
     */
    protected $middleware = [
        \Illuminate\Http\Middleware\HandleCors::class, // 🔹 CORS integrado en Laravel 9+
    ];

    /**
     * The application's route middleware groups.
     *
     * @var array
     */
    protected $middlewareGroups = [
        'web' => [
            \App\Http\Middleware\EncryptCookies::class,
            \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
            \Illuminate\Session\Middleware\StartSession::class,
            \Illuminate\View\Middleware\ShareErrorsFromSession::class,
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ],

        'api' => [
            // 🔹 Esto permite que tu frontend (React) use cookies de Sanctum
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,

            // 🔹 Necesarios para sesiones con Sanctum
            \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
            \Illuminate\Session\Middleware\StartSession::class,
            \Illuminate\View\Middleware\ShareErrorsFromSession::class,

            'throttle:api',
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ],
    ];

    /**
     * The application's route middleware aliases.
     *
     * @var array
     */
    protected $middlewareAliases = [
        'auth'        => \App\Http\Middleware\Authenticate::class, // ✅ necesario para auth:sanctum
        'guest'       => \App\Http\Middleware\RedirectIfAuthenticated::class,
        'verified'    => \Illuminate\Auth\Middleware\EnsureEmailIsVerified::class,
        'tipo_usuario'=> \App\Http\Middleware\TipoUsuario::class,
    ];
}
