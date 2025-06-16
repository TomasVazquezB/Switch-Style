<?php

namespace App\Http\Controllers;

use App\Models\Ropa;
use App\Models\Imagen;
use App\Models\Categoria;
use App\Models\Genero;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class RopaController extends Controller
{
    public function index(Request $request)
    {
        $query = auth()->user()->Tipo_Usuario === 'admin'
            ? Ropa::query()
            : Ropa::propias();

        // Excluir accesorios
        $query->whereHas('categoria', function ($q) {
            $q->whereNotIn('nombre', ['Collares', 'Aritos', 'Anillos']);
        });

        if ($request->filled('busqueda')) {
            $query->where('titulo', 'like', '%' . $request->busqueda . '%');
        }

        if ($request->filled('categoria_id')) {
            $query->where('categoria_id', $request->categoria_id);
        }

        if ($request->filled('genero_id')) {
            $query->where('genero_id', $request->genero_id);
        }

        $ropas = $query->latest()->paginate(8)->appends($request->query());

        return view('ropas.index', [
            'ropas' => $ropas,
            'categorias' => Categoria::whereNotIn('nombre', ['Collares', 'Aritos', 'Anillos'])->get(),
            'generos' => Genero::all()
        ]);
    }

    public function create()
    {
        return view('ropas.create', [
            'categorias' => Categoria::whereNotIn('nombre', ['Anillos', 'Collares', 'Aritos'])->get(),
            'tallas' => \App\Models\Talla::all(),
            'generos' => \App\Models\Genero::all(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'titulo' => 'required|string',
            'descripcion' => 'required|string',
            'precio' => 'required|numeric',
            'categoria_id' => 'required|exists:categorias,id',
            'genero_id' => 'required|exists:generos,id',
            'tallas' => 'required|array',
            'tallas.*.id' => 'required|exists:tallas,id',
            'tallas.*.cantidad' => 'required|integer|min:0',
            'imagenes.*' => 'nullable|image|max:2048',
        ]);

        DB::transaction(function () use ($request) {
            $ropa = Ropa::create([
                'titulo' => $request->titulo,
                'descripcion' => $request->descripcion,
                'precio' => $request->precio,
                'categoria_id' => $request->categoria_id,
                'genero_id' => $request->genero_id,
                'ID_Usuario' => auth()->id(),
            ]);

            foreach ($request->tallas as $tallaData) {
                if ((int)$tallaData['cantidad'] > 0) {
                    $ropa->tallas()->attach($tallaData['id'], [
                        'cantidad' => $tallaData['cantidad'],
                    ]);
                }
            }

            if ($request->hasFile('imagenes')) {
                foreach ($request->file('imagenes') as $index => $imagen) {
                    $ruta = $imagen->store('ropa', 'public');
                    $ropa->imagenes()->create(['ruta' => $ruta]);

                    if ($index === 0) {
                        $ropa->update(['ruta_imagen' => $ruta]);
                    }
                }
            }
        });

        return redirect()->route('ropas.index')->with('success', 'Prenda guardada.');
    }

    public function edit(Ropa $ropa)
{
    $ropa->load('tallas');

    return view('ropas.edit', [
        'ropa' => $ropa,
        'categorias' => Categoria::whereNotIn('nombre', ['Anillos', 'Collares', 'Aritos'])->get(),
        'tallas' => \App\Models\Talla::all(),
        'generos' => \App\Models\Genero::all(),
    ]);
}

    public function update(Request $request, Ropa $ropa)
    {
        $request->validate([
            'titulo' => 'required|string',
            'descripcion' => 'required|string',
            'precio' => 'required|numeric',
            'categoria_id' => 'required|exists:categorias,id',
            'genero_id' => 'required|exists:generos,id',
            'tallas' => 'required|array',
            'tallas.*.id' => 'required|exists:tallas,id',
            'tallas.*.cantidad' => 'required|integer|min:0',
            'imagenes.*' => 'nullable|image|max:2048',
        ]);

        DB::transaction(function () use ($request, $ropa) {
            $ropa->update([
                'titulo' => $request->titulo,
                'descripcion' => $request->descripcion,
                'precio' => $request->precio,
                'categoria_id' => $request->categoria_id,
                'genero_id' => $request->genero_id,
            ]);

            $syncData = [];
            foreach ($request->tallas as $tallaData) {
                if ((int)$tallaData['cantidad'] > 0) {
                    $syncData[$tallaData['id']] = ['cantidad' => $tallaData['cantidad']];
                }
            }
            $ropa->tallas()->sync($syncData);

            if ($request->hasFile('imagenes')) {
                foreach ($request->file('imagenes') as $index => $imagen) {
                    $ruta = $imagen->store('ropa', 'public');
                    $ropa->imagenes()->create(['ruta' => $ruta]);

                    if (!$ropa->ruta_imagen || $index === 0) {
                        $ropa->update(['ruta_imagen' => $ruta]);
                    }
                }
            }
        });

        return redirect()->route('ropas.index')->with('success', 'Prenda actualizada.');
    }

    public function destroy(Ropa $ropa)
    {
        foreach ($ropa->imagenes as $img) {
            if (Storage::disk('public')->exists($img->ruta)) {
                Storage::disk('public')->delete($img->ruta);
            }
            $img->delete();
        }

        if ($ropa->ruta_imagen && Storage::disk('public')->exists($ropa->ruta_imagen)) {
            Storage::disk('public')->delete($ropa->ruta_imagen);
        }

        $ropa->tallas()->detach();

        $ropa->delete();

        return redirect()->route('ropas.index')->with('success', 'Prenda eliminada.');
    }
}
