<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckUserIsActive
{
    public function handle(Request $request, Closure $next)
    {
        // Si no hay usuario autenticado, que lo resuelva 'auth'
        if (!$request->user()) {
            return redirect()->route('login');
        }

        if (!$request->user()->is_active) {
            Auth::logout();
            return redirect()->route('login')
                ->withErrors(['login' => 'Cuenta deshabilitada por un administrador.']);
        }

        return $next($request);
    }
}
