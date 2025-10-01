<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class CheckUserIsActive
{
    public function handle($request, Closure $next)
    {
        if (Auth::check() && !Auth::user()->is_active) {
            Auth::logout();
            return redirect()->route('login')->withErrors([
                'Correo_Electronico' => 'Tu cuenta está deshabilitada. Contacta al administrador.',
            ]);
        }

        return $next($request);
    }
}
