<?php

namespace App\Services;

use Kreait\Firebase\Auth as FirebaseAuth;

class FirebaseAuthService
{
    protected FirebaseAuth $auth;

    public function __construct(FirebaseAuth $auth)
    {
        $this->auth = $auth;
    }

    public function verifyIdToken(string $idToken)
    {
        try {
            $verifiedIdToken = $this->auth->verifyIdToken($idToken);
            return $verifiedIdToken->claims()->get('sub'); // UID usuario Firebase
        } catch (\Exception $e) {
            return null; // Token inválido
        }
    }
}
