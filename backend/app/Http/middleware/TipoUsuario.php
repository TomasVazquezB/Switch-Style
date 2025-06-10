<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TipoUsuario
{
    public function handle(Request $request, Closure $next, ...$tipos)
    {
        $usuario = auth()->user();

        if (!$usuario || !in_array(strtolower($usuario->Tipo_Usuario), $tipos)) {
            abort(403, 'Acceso no autorizado');
        }

        return $next($request);
    }
}
