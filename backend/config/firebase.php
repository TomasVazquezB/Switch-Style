<?php

return [
    'credentials' => [
        // Ruta al archivo JSON de las credenciales Firebase
        'file' => env('FIREBASE_CREDENTIALS_JSON', storage_path('firebase/firebase_credentials.json')),
    ],

    'firestore' => [
        // ID del proyecto Firebase
        'project_id' => env('FIREBASE_PROJECT_ID', 'petpalms-717eb'),
    ],
];
