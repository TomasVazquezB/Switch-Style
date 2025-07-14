<?php

return [
    'credentials' => [
        'file' => env('FIREBASE_CREDENTIALS') ?: (env('APP_ENV') === 'production' ? '/tmp/firebase_credentials.json' : base_path('firebase_credentials.json')),
    ],

    'firestore' => [
        'project_id' => env('FIREBASE_PROJECT_ID', 'petpalms-717eb'),
    ],
];
