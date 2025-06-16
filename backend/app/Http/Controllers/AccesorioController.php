<?php

namespace App\Http\Controllers;

use App\Models\Accesorio;
use App\Models\Categoria;
use App\Models\ImagenAccesorio;
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

                    ImagenAccesorio::create([
                        'ruta' => $ruta,
                        'accesorio_id' => $accesorio->id,
                    ]);

                    if ($index === 0) {
                        $accesorio->update(['ruta_imagen' => $ruta]);
                    }
                }
            }
        });

        return redirect()->route('accesorios.index')->with('success', 'Accesorio creado correctamente.');
    }

    public function edit($id)
    {
        $accesorio = Accesorio::with('imagenes')->findOrFail($id);
        $categorias = Categoria::whereIn('nombre', ['Anillos', 'Collares', 'Aritos'])->get();

        return view('accesorios.edit', compact('accesorio', 'categorias'));
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'precio' => 'required|numeric',
            'categoria_id' => 'required|exists:categorias,id',
            'imagenes.*' => 'nullable|image|max:2048',
        ]);

        DB::transaction(function () use ($request, $id) {
            $accesorio = Accesorio::findOrFail($id);

            $accesorio->update([
                'titulo' => $request->titulo,
                'descripcion' => $request->descripcion,
                'precio' => $request->precio,
                'categoria_id' => $request->categoria_id,
            ]);

            if ($request->hasFile('imagenes')) {
                foreach ($request->file('imagenes') as $index => $imagen) {
                    $ruta = $imagen->store('accesorios', 'public');

                    ImagenAccesorio::create([
                        'ruta' => $ruta,
                        'accesorio_id' => $accesorio->id,
                    ]);

                    if ($index === 0 && !$accesorio->ruta_imagen) {
                        $accesorio->update(['ruta_imagen' => $ruta]);
                    }
                }
            }
        });

        return redirect()->route('accesorios.index')->with('success', 'Accesorio actualizado correctamente.');
    }

    public function destroy($id)
    {
        $accesorio = Accesorio::with('imagenes')->findOrFail($id);

        DB::transaction(function () use ($accesorio) {
            // Eliminar imágenes físicas
            foreach ($accesorio->imagenes as $imagen) {
                if ($imagen->ruta && Storage::disk('public')->exists($imagen->ruta)) {
                    Storage::disk('public')->delete($imagen->ruta);
                }
                $imagen->delete();
            }

            // Eliminar imagen principal si existe
            if ($accesorio->ruta_imagen && Storage::disk('public')->exists($accesorio->ruta_imagen)) {
                Storage::disk('public')->delete($accesorio->ruta_imagen);
            }

            // Eliminar el accesorio
            $accesorio->delete();
        });

        return redirect()->route('accesorios.index')->with('success', 'Accesorio eliminado correctamente.');
    }
}
