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

        
        $isActive = null;

        if (isset($user->is_active)) {          
            $isActive = (bool) $user->is_active;
        } elseif (isset($user->Activo)) {        
            $isActive = (bool) $user->Activo;
        } elseif (isset($user->active)) {
            $isActive = (bool) $user->active;
        }

        
        if ($isActive === false) {
            
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Tu cuenta está inactiva. Contactá al administrador.'
                ], 403);
            }

            
            auth()->logout();
            return redirect()
                ->route('login')
                ->withErrors(['inactive' => 'Tu cuenta está inactiva. Contactá al administrador.']);
        }

        return $next($request);
    }
}
