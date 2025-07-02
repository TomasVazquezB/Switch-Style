<?php

namespace App\Services;

use Kreait\Firebase\Factory;
use Kreait\Firebase\ServiceAccount;
use Kreait\Firebase\Auth;
use Kreait\Firebase\Firestore;

class FirebaseService
{
    protected $auth;
    protected $firestore;

    public function __construct()
    {
        $serviceAccount = ServiceAccount::fromJsonFile(config('firebase.credentials.file'));
        $firebase = (new Factory)->withServiceAccount($serviceAccount);

        $this->auth = $firebase->createAuth();
        $this->firestore = $firebase->createFirestore();
    }

    public function getAuth()
    {
        return $this->auth;
    }

    public function getFirestore()
    {
        return $this->firestore;
    }
}
