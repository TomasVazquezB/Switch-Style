<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default Filesystem Disk
    |--------------------------------------------------------------------------
    */
    'default' => env('FILESYSTEM_DISK', 's3'),

    /*
    |--------------------------------------------------------------------------
    | Filesystem Disks
    |--------------------------------------------------------------------------
    */
    'disks' => [

        'local' => [
            'driver' => 'local',
            'root' => storage_path('app/private'),
            'serve' => true,
            'throw' => false,
            'report' => false,
        ],

        'public' => [
            'driver' => 'local',
            'root' => storage_path('app/public'),
            'url' => env('APP_URL').'/storage',
            'visibility' => 'public',
            'throw' => false,
            'report' => false,
        ],

        's3' => [
            'driver' => 's3',
            'key' => env('AWS_ACCESS_KEY_ID', '5c4e5977ef54a3734f1e74b1c8512dc7'),
            'secret' => env('AWS_SECRET_ACCESS_KEY', '071be19b6dc4349585b7641b0f1fb75874ae251fb3a37bf5d96a2638ef65ce2b'),
            'region' => env('AWS_DEFAULT_REGION', 'auto'),
            'bucket' => env('AWS_BUCKET', 'fls-9ff7de2a-dac8-4f28-a8fd-04a22564ad02'),
            'url' => env('AWS_URL', 'https://fls-9ff7de2a-dac8-4f28-a8fd-04a22564ad02.laravel.cloud'),
            'endpoint' => env('AWS_ENDPOINT', 'https://367be3a2035528943240074d0096e0cd.r2.cloudflarestorage.com'),
            'use_path_style_endpoint' => env('AWS_USE_PATH_STYLE_ENDPOINT', true),
            'visibility' => 'public',
            'throw' => false,
            'report' => false,
        ],

    ],

    /*
    |--------------------------------------------------------------------------
    | Symbolic Links
    |--------------------------------------------------------------------------
    */
    'links' => [
        public_path('storage') => storage_path('app/public'),
    ],

];
