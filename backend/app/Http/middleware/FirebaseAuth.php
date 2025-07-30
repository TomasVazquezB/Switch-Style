<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Services\FirebaseAuthService;

class FirebaseAuth
{
    protected FirebaseAuthService $firebase;

    public function __construct(FirebaseAuthService $firebase)
    {
        $this->firebase = $firebase;
    }

    public function handle(Request $request, Closure $next)
    {
        $token = $request->bearerToken();

        $uid = $this->firebase->verifyIdToken($token);

        if (!$uid) {
            return response()->json(['error' => 'Token inválido'], 401);
        }

        $request->merge(['firebase_uid' => $uid]);

        return $next($request);
    }
}