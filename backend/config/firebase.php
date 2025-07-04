<?php

return [
       'credentials' => [
        'file' => env('FIREBASE_CREDENTIALS_JSON', storage_path('app/firebase/firebase-services.json')),
    ],

    'firestore' => [
        // ID del proyecto Firebase
        'project_id' => env('FIREBASE_PROJECT_ID', 'petpalms-717eb'),
    ],
];
