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

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'], // Todos los métodos HTTP permitidos (GET, POST, etc.)

    'allowed_origins' => [
        'http://localhost:5173',           // Vite local
        'https://switchstyle.laravel.cloud', // Producción
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'], // Todos los headers permitidos

    'exposed_headers' => [],

    'max_age' => 0, // Tiempo de cache para preflight (en segundos)

    'supports_credentials' => true, // Permite cookies y credenciales
];
