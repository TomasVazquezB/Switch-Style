<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class TipoUsuario
{
    /**
     * Maneja una solicitud entrante.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @param  mixed  ...$tiposPermitidos
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle($request, Closure $next, ...$tiposPermitidos)
    {
        // Verifica si hay un usuario autenticado
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        $usuario = Auth::user();
        $tipo = strtolower($usuario->Tipo_Usuario); // Asegurate de que esta columna existe en tu tabla 'users'
        $permitidos = array_map('strtolower', $tiposPermitidos);

        if (!in_array($tipo, $permitidos)) {
            abort(403, 'Acceso denegado.');
        }

        return $next($request);
    }
}
