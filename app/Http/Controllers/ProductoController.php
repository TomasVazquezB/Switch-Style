<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Producto; // Asumiendo que tienes un modelo Producto

class ProductoController extends Controller
{
    // 🔹 Traer todos los productos
    public function index()
    {
        $productos = Producto::all();

        // Agregar URL completa de la imagen
        $productos->transform(function ($producto) {
            if ($producto->tipo === 'ropa') {
                $producto->imagen_url = asset('storage/ropa/' . $producto->imagen);
            } elseif ($producto->tipo === 'accesorio') {
                $producto->imagen_url = asset('storage/accesorios/' . $producto->imagen);
            }
            return $producto;
        });

        return response()->json($productos);
    }

    // 🔹 Crear producto
    public function store(Request $request)
    {
        $data = $request->validate([
            'nombre' => 'required|string',
            'precio' => 'required|numeric',
            'descripcion' => 'nullable|string',
            'tipo' => 'required|string',
            'imagen' => 'required|image|max:2048', // Validar que sea imagen
        ]);

        // Guardar imagen
        $path = $request->file('imagen')->store('public/' . $data['tipo']);
        $data['imagen'] = basename($path);

        $producto = Producto::create($data);

        return response()->json($producto, 201);
    }

    // 🔹 Actualizar producto
    public function update(Request $request, $id)
    {
        $producto = Producto::findOrFail($id);

        $data = $request->validate([
            'nombre' => 'sometimes|string',
            'precio' => 'sometimes|numeric',
            'descripcion' => 'nullable|string',
            'tipo' => 'sometimes|string',
            'imagen' => 'sometimes|image|max:2048',
        ]);

        if ($request->hasFile('imagen')) {
            $path = $request->file('imagen')->store('public/' . $data['tipo']);
            $data['imagen'] = basename($path);
        }

        $producto->update($data);

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
