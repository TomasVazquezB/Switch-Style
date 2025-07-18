<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Kreait\Firebase\Contract\Firestore;

class ProductoController extends Controller
{
    protected $firestore;

    public function __construct(Firestore $firestore)
    {
        $this->firestore = $firestore->database();
    }

    public function index()
    {
        $productosRef = $this->firestore->collection('productos');
        $documents = $productosRef->documents();

        $productos = [];

        foreach ($documents as $document) {
            if ($document->exists()) {
                $producto = $document->data();
                $producto['id'] = $document->id();
                $productos[] = $producto;
            }
        }

        return response()->json($productos);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nombre' => 'required|string',
            'precio' => 'required|numeric',
            'descripcion' => 'nullable|string',
        ]);

        $this->firestore->collection('productos')->add($data);

        return response()->json(['message' => 'Producto creado correctamente'], 201);
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'nombre' => 'sometimes|string',
            'precio' => 'sometimes|numeric',
            'descripcion' => 'nullable|string',
        ]);

        $document = $this->firestore->collection('productos')->document($id);
        $document->set($data, ['merge' => true]);

        return response()->json(['message' => 'Producto actualizado correctamente']);
    }

    public function destroy($id)
    {
        $document = $this->firestore->collection('productos')->document($id);
        $document->delete();

        return response()->json(['message' => 'Producto eliminado correctamente']);
    }
}
