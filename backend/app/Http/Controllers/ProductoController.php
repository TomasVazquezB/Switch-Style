<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Producto;
use App\Models\Accesorio;
use App\Models\Ropa;

class ProductoController extends Controller
{
    public function buscar(Request $request)
    {
        $query = $request->query('q');

        $ropaResultados = \App\Models\Ropa::where('titulo', 'LIKE', "%$query%")
            ->orWhere('descripcion', 'LIKE', "%$query%")
            ->get();

        $accesorioResultados = \App\Models\Accesorio::where('titulo', 'LIKE', "%$query%")
            ->orWhere('descripcion', 'LIKE', "%$query%")
            ->get();

        $resultados = $ropaResultados->concat($accesorioResultados)->values();

        return response()->json($resultados);
    }

}
