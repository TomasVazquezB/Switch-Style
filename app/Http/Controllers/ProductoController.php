<?php

namespace App\Http\Controllers;

use App\Services\FirebaseService;
use Illuminate\Http\Request;

class ProductoController extends Controller
{
    protected $firebase;

    public function __construct(FirebaseService $firebase)
    {
        $this->firebase = $firebase;
    }

    public function index()
    {
        $firestore = $this->firebase->getFirestore();
        $productosRef = $firestore->collection('productos');
        $snapshot = $productosRef->documents();

        $productos = [];
        foreach ($snapshot as $document) {
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

        $firestore = $this->firebase->getFirestore();
        $firestore->collection('productos')->add($data);

        return response()->json(['message' => 'Producto creado correctamente']);
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'nombre' => 'sometimes|string',
            'precio' => 'sometimes|numeric',
            'descripcion' => 'nullable|string',
        ]);

        $firestore = $this->firebase->getFirestore();
        $firestore->collection('productos')->document($id)->set($data, ['merge' => true]);

        return response()->json(['message' => 'Producto actualizado correctamente']);
    }

    public function destroy($id)
    {
        $firestore = $this->firebase->getFirestore();
        $firestore->collection('productos')->document($id)->delete();

        return response()->json(['message' => 'Producto eliminado correctamente']);
    }
}
