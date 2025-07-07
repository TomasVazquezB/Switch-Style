<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Favorito;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FavoritoController extends Controller
{
    // Obtener todos los favoritos del usuario autenticado
    public function index()
    {
        $usuarioId = Auth::id();

        $favoritos = Favorito::where('user_id', $usuarioId)->get();

        return response()->json($favoritos);
    }

    // Agregar un nuevo favorito
    public function store(Request $request)
    {
        $request->validate([
            'favoritable_id' => 'required|integer',
            'favoritable_type' => 'required|string', // Ej: "ropa" o "accesorio"
        ]);

        $tipo = $request->favoritable_type === 'ropa'
            ? 'App\\Models\\Ropa'
            : 'App\\Models\\Accesorio';

        $favorito = Favorito::firstOrCreate([
            'user_id' => Auth::id(),
            'favoritable_id' => $request->favoritable_id,
            'favoritable_type' => $tipo,
        ]);

        return response()->json($favorito, 201);
    }

    // Eliminar un favorito
    public function destroy($id)
    {
        $usuarioId = Auth::id();

        $favorito = Favorito::where('id', $id)
            ->where('user_id', $usuarioId)
            ->first();

        if (!$favorito) {
            return response()->json(['error' => 'Favorito no encontrado'], 404);
        }

        $favorito->delete();

        return response()->json(['mensaje' => 'Favorito eliminado']);
    }
}
