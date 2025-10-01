<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckUserIsActive
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if ($user && !$user->is_active) {
            auth()->logout();
            return redirect()->route('login')
                ->withErrors(['Cuenta deshabilitada por un administrador.']);
        }

        return $next($request);
    }
}
