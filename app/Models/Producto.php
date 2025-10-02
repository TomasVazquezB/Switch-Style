<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use Illuminate\Http\Request;

class ProductoController extends Controller
{
    // 🔹 Listar productos
    public function index()
    {
        $productos = Producto::all()->map(function($producto) {
            $producto->imagen_url = asset('storage/' . $producto->Imagen); 
            // Esto genera la URL completa: http://tudominio.com/storage/ropa/imagen.jpg
            return $producto;
        });

        return response()->json($productos);
    }

    // 🔹 Crear producto
    public function store(Request $request)
    {
        $data = $request->validate([
            'Nombre' => 'required|string',
            'Precio' => 'required|numeric',
            'Descripción' => 'nullable|string',
            'Tipo' => 'required|string',
            'Imagen' => 'required|string', // nombre de archivo guardado en storage
            'ID_Tienda' => 'required|integer'
        ]);

        $producto = Producto::create($data);

        $producto->imagen_url = asset('storage/' . $producto->Imagen);

        return response()->json($producto, 201);
    }

    // 🔹 Actualizar producto
    public function update(Request $request, $id)
    {
        $producto = Producto::findOrFail($id);

        $data = $request->validate([
            'Nombre' => 'sometimes|string',
            'Precio' => 'sometimes|numeric',
            'Descripción' => 'nullable|string',
            'Tipo' => 'sometimes|string',
            'Imagen' => 'sometimes|string'
        ]);

        $producto->update($data);

        $producto->imagen_url = asset('storage/' . $producto->Imagen);

        return response()->json($producto);
    }

    // 🔹 Eliminar producto
    public function destroy($id)
    {
        $producto = Producto::findOrFail($id);
        $producto->delete();

        return response()->json(['message' => 'Producto eliminado correctamente']);
    }
}
