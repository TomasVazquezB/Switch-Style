<?php

namespace App\Http\Controllers;

use App\Models\Ropa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class RopaController extends Controller
{
    public function index()
{
    if (auth()->user()->Tipo_Usuario === 'admin') {
        $ropas = Ropa::latest()->get();
    } else {
        $ropas = Ropa::where('ID_Usuario', auth()->id())->latest()->get();
    }

    return view('ropas.index', compact('ropas'));
}

    public function create()
    {
        return view('ropas.create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'titulo' => 'required',
            'descripcion' => 'required',
            'precio' => 'required|numeric',
            'cantidad' => 'required|integer',
            'talla' => 'required',
            'categoria' => 'required',
            'genero' => 'required',
            'imagen' => 'required|image|max:2048',
        ]);

        $ruta = $request->file('imagen')->store('ropa', 'public');

        Ropa::create([
    'titulo' => $request->titulo,
    'descripcion' => $request->descripcion,
    'precio' => $request->precio,
    'cantidad' => $request->cantidad,
    'talla' => $request->talla,
    'categoria' => $request->categoria,
    'genero' => $request->genero,
    'ruta_imagen' => $ruta,
    'ID_Usuario' => auth()->id(), // 👈 Asigna el usuario actual
]);


        return redirect()->route('ropas.index')->with('success', 'Prenda guardada.');
    }

    public function edit(Ropa $ropa)
    {
        return view('ropas.edit', compact('ropa'));
    }

    public function update(Request $request, Ropa $ropa)
    {
        $request->validate([
    'titulo' => 'required',
    'descripcion' => 'required',
    'precio' => 'required|numeric',
    'cantidad' => 'required|integer',
    'talla' => 'required|in:S,M,L,XL,XXL',
    'categoria' => 'required|in:Remeras,Pantalones,Camperas,Shorts,Faldas,Vestidos',
    'genero' => 'required|in:Hombre,Mujer',
    'imagen' => 'nullable|image|max:2048',
]);
    

        if ($request->hasFile('imagen')) {
            if ($ropa->ruta_imagen && Storage::disk('public')->exists($ropa->ruta_imagen)) {
                Storage::disk('public')->delete($ropa->ruta_imagen);
            }
            $ropa->ruta_imagen = $request->file('imagen')->store('ropa', 'public');
        }

        $ropa->update($request->except('imagen'));

        return redirect()->route('ropas.index')->with('success', 'Prenda actualizada.');
    }

    public function destroy(Ropa $ropa)
    {
        if ($ropa->ruta_imagen && Storage::disk('public')->exists($ropa->ruta_imagen)) {
            Storage::disk('public')->delete($ropa->ruta_imagen);
        }

        $ropa->delete();

        return redirect()->route('ropas.index')->with('success', 'Prenda eliminada.');
    }
}
