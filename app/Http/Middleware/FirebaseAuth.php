<?php

namespace App\Http\Middleware;

use Closure;
use Kreait\Firebase\Auth;
use Illuminate\Http\Request;

class FirebaseAuth
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->bearerToken();
        try {
            $verified = app(Auth::class)->verifyIdToken($token);
            $uid = $verified->claims()->get('sub');
            $request->merge(['firebase_uid' => $uid]);
            return $next($request);
        } catch (\Throwable $e) {
            return response()->json(['error' => 'Token inválido'], 401);
        }
    }
}
