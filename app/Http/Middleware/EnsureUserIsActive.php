<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsActive
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            return $next($request);
        }

        $isActive = $user->is_active ?? ($user->Activo ?? true);

        if (! $isActive) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Tu cuenta está inactiva.'], 403);
            }
            auth()->logout();
            return redirect()->route('login')
                ->withErrors(['inactive' => 'Tu cuenta está inactiva.']);
        }

        return $next($request);
    }
}
