<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class TipoUsuario
{
    public function handle($request, Closure $next, ...$tiposPermitidos)
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        $usuario = Auth::user();
        $tipo = strtolower($usuario->Tipo_Usuario); // Verifica con la columna de tu base
        $permitidos = array_map('strtolower', $tiposPermitidos);

        if (!in_array($tipo, $permitidos)) {
            abort(403, 'Acceso denegado.');
        }

        return $next($request);
    }
}
