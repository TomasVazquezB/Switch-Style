<?php
namespace App\Services;

use Kreait\Firebase\Factory;
use Kreait\Firebase\Auth;
use Google\Cloud\Firestore\FirestoreClient;

class FirebaseService
{
    protected $firestore;
    protected $auth;

    public function __construct()
    {
        $factory = (new Factory)->withServiceAccount(env('GOOGLE_APPLICATION_CREDENTIALS'));

        $this->firestore = $factory->createFirestore()->database();
        $this->auth = $factory->createAuth();
    }

    public function getFirestore()
    {
        return $this->firestore;
    }

    public function getAuth()
    {
        return $this->auth;
    }
}
