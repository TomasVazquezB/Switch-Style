<?php

namespace App\Services;

use Kreait\Firebase\Factory;
use Kreait\Firebase\Auth;

class FirebaseService
{
    protected $auth;
    protected $firestore;

    public function __construct()
    {
        $firebaseCredentials = config('firebase.credentials.file');

        if (!file_exists($firebaseCredentials)) {
            throw new \Exception("Archivo de credenciales Firebase no encontrado en: $firebaseCredentials");
        }

        $factory = (new Factory)
            ->withServiceAccount($firebaseCredentials);

        $this->auth = $factory->createAuth();
        $this->firestore = $factory->createFirestore();
    }

    public function getAuth(): Auth
    {
        return $this->auth;
    }

    public function getFirestore() // Devuelve instancia de Google\Cloud\Firestore\FirestoreClient
    {
        return $this->firestore->database(); // Este es el objeto real que tiene ->collection()
    }
}
