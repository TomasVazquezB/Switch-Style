<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class IsAdmin
{
    public function handle(Request $request, Closure $next)
    {
        if (Auth::check() && Auth::user()->Tipo_Usuario === 'Admin') {
            return $next($request);
        }

        abort(403, 'Acceso denegado: No sos administrador.');
    }
}
