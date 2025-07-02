<?php

return [
    // Configuración de las credenciales de Firebase
    'credentials' => [
        // Ruta al archivo JSON de las credenciales de Firebase
        'file' => env('FIREBASE_CREDENTIALS_JSON', storage_path('app/firebase/firebase-services.json')),
    ],

    // Configuración de Firestore
    'firestore' => [
        'project_id' => env('FIREBASE_PROJECT_ID', 'your-project-id'),  // Si usas Firestore
    ]
];
