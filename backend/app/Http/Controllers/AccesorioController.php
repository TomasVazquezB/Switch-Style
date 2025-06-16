<?php

namespace App\Http\Controllers;

use App\Models\Accesorio;
use App\Models\Categoria;
use App\Models\Imagen;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class AccesorioController extends Controller
{
    public function index(Request $request)
    {
        $query = auth()->user()->Tipo_Usuario === 'admin'
            ? Accesorio::query()
            : Accesorio::where('ID_Usuario', auth()->id());

        if ($request->filled('categoria_id')) {
            $query->where('categoria_id', $request->categoria_id);
        }

        $accesorios = $query->latest()->paginate(8);
        $categorias = Categoria::whereIn('nombre', ['Anillos', 'Collares', 'Aritos'])->get();

        return view('accesorios.index', compact('accesorios', 'categorias'));
    }

    public function create()
    {
        $categorias = Categoria::whereIn('nombre', ['Anillos', 'Collares', 'Aritos'])->get();

        return view('accesorios.create', compact('categorias'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'precio' => 'required|numeric',
            'categoria_id' => 'required|exists:categorias,id',
            'imagenes.*' => 'nullable|image|max:2048',
        ]);

        DB::transaction(function () use ($request) {
            $accesorio = Accesorio::create([
                'titulo' => $request->titulo,
                'descripcion' => $request->descripcion,
                'precio' => $request->precio,
                'categoria_id' => $request->categoria_id,
                'ID_Usuario' => auth()->id(),
            ]);

            if ($request->hasFile('imagenes')) {
                foreach ($request->file('imagenes') as $index => $imagen) {
                    $ruta = $imagen->store('accesorios', 'public');
                    $accesorio->imagenes()->create(['ruta' => $ruta]);

                    if ($index === 0) {
                        $accesorio->update(['ruta_imagen' => $ruta]);
                    }
                }
            }
        });

        return redirect()->route('accesorios.index')->with('success', 'Accesorio creado correctamente.');
    }
}
