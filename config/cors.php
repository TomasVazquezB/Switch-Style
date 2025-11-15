<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Aquí defines qué rutas pueden recibir peticiones desde otros orígenes,
    | qué métodos y headers están permitidos, y si soporta credenciales.
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'logout', 'register', 'user', 'crear-pedido'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:5173',
        'http://localhost:5174',     
        'http://127.0.0.1:5173',   
        'http://127.0.0.1:5174',     
        'https://switchstyle.laravel.cloud',
        'https://switchstyle.vercel.app',
    ],

/*     'allowed_origins_patterns' => ['#^https://.*switchstyle.*\.vercel\.app$#'],*/
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,

    'supports_credentials' => true,
];


