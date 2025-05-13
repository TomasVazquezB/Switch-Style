<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use App\Models\Producto;


class ProductoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Producto::all(); // Retorna todos los registros
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $producto = new \App\Models\Producto();
        $producto->Nombre = $request->Nombre;
        $producto->Descripción = $request->Descripción;
        $producto->Precio = $request->Precio;
        $producto->Tipo = $request->Tipo;
        $producto->Imagen = $request->Imagen;
        $producto->ID_Tienda = $request->ID_Tienda;
        $producto->save();

        return response()->json(['message' => 'Producto creado', 'producto' => $producto], 201);
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
