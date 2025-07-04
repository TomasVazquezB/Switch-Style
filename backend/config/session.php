<?php

use Illuminate\Support\Str;

return [

    'driver' => env('SESSION_DRIVER', 'cookie'),

    'lifetime' => (int) env('SESSION_LIFETIME', 120),

    'expire_on_close' => env('SESSION_EXPIRE_ON_CLOSE', false),

    'encrypt' => env('SESSION_ENCRYPT', false),

    'files' => storage_path('framework/sessions'),

    'connection' => env('SESSION_CONNECTION'),

    'table' => env('SESSION_TABLE', 'sessions'),

    'store' => env('SESSION_STORE'),

    'lottery' => [2, 100],

    'cookie' => env(
        'SESSION_COOKIE',
        Str::slug(env('APP_NAME', 'laravel'), '_').'_session'
    ),

    'path' => env('SESSION_PATH', '/'),

    'domain' => env('SESSION_DOMAIN', 'localhost'), // ⚠️ CLAVE PARA USARLO CON REACT SPA

    'secure' => env('SESSION_SECURE_COOKIE', false), // ⚠️ en desarrollo debe ser false

    'http_only' => env('SESSION_HTTP_ONLY', true),

    'same_site' => env('SESSION_SAME_SITE', 'lax'), // ⚠️ 'lax' en dev, 'none' si usás https

    'partitioned' => env('SESSION_PARTITIONED_COOKIE', false),

];
