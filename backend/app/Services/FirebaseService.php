<?php

namespace App\Services;

use Kreait\Firebase\Factory;

class FirebaseService
{
    protected $firestore;

    public function __construct()
    {
        $jsonString = env('FIREBASE_CREDENTIALS_JSON');

        $path = storage_path('app/firebase/firebase_credentials.json');

        if (!file_exists($path)) {
            if (!is_dir(dirname($path))) {
                mkdir(dirname($path), 0755, true);
            }
            file_put_contents($path, $jsonString);
        }

        $factory = (new Factory)->withServiceAccount($path);
        $this->firestore = $factory->createFirestore()->database();
    }

    public function getFirestore()
    {
        return $this->firestore;
    }
}
