<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class TipoUsuario
{
    
    public function handle(Request $request, Closure $next, ...$tiposPermitidos): Response
    {
        if (!Auth::check()) {
            abort(401, 'No autenticado.');
        }

        $user = Auth::user();

        $rawTipo = $user->Tipo_Usuario ?? $user->tipo_usuario ?? null;
        if ($rawTipo === null) {
            abort(403, 'El usuario no tiene tipo asignado.');
        }

        $tipoNormalizado = strtolower(trim((string) $rawTipo));

        $permitidos = array_map(
            fn($t) => strtolower(trim((string) $t)),
            $tiposPermitidos ?? []
        );

        if (empty($permitidos)) {
            return $next($request);
        }

        if (in_array($tipoNormalizado, $permitidos, true)) {
            return $next($request);
        }

        abort(403, 'Acceso denegado.');
    }
}
