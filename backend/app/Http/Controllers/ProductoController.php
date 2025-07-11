<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Producto;

class ProductoController extends Controller
{
    public function buscar(Request $request)
    {
        $query = $request->input('q');

        if (!$query) {
            return response()->json(['error' => 'No se proporcionó término de búsqueda'], 400);
        }

        $productos = Producto::where('titulo', 'like', "%{$query}%")
            ->orWhere('descripcion', 'like', "%{$query}%")
            ->get();

        return response()->json($productos);
    }
}
