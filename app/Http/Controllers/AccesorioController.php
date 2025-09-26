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
            'titulo'       => 'required|string|max:255',
            'descripcion'  => 'required|string',
            'precio'       => 'required|numeric',
            'stock'        => 'required|integer|min:0',
            'categoria_id' => 'required|exists:categorias,id',
            'imagenes.*'   => 'nullable|image|max:2048',
        ]);

        DB::transaction(function () use ($request) {
            $accesorio = Accesorio::create([
                'titulo'       => $request->titulo,
                'descripcion'  => $request->descripcion,
                'precio'       => $request->precio,
                'stock'        => $request->stock,
                'categoria_id' => $request->categoria_id,
                'ID_Usuario'   => auth()->id(),
            ]);

            if ($request->hasFile('imagenes')) {
                foreach ($request->file('imagenes') as $index => $imagen) {
                    $ruta = $imagen->store('accesorios', 'public'); // p.ej. public/accesorios/xxx.jpg
                    $ruta = ltrim(str_replace('public/', '', $ruta), '/'); // => accesorios/xxx.jpg

                    ImagenAccesorio::create([
                        'ruta'         => $ruta,
                        'accesorio_id' => $accesorio->id,
                        'es_principal' => $index === 0,
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
        $accesorio  = Accesorio::with('imagenes')->findOrFail($id);
        $categorias = Categoria::whereIn('nombre', ['Anillos', 'Collares', 'Aritos'])->get();

        return view('accesorios.edit', compact('accesorio', 'categorias'));
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'titulo'       => 'required|string|max:255',
            'descripcion'  => 'required|string',
            'precio'       => 'required|numeric',
            'stock'        => 'required|integer|min:0',
            'categoria_id' => 'required|exists:categorias,id',
            'imagenes.*'   => 'nullable|image|max:2048',
            'principal'    => 'nullable|integer',  // id de ImagenAccesorio elegida como principal
            'borrar'       => 'array',
            'borrar.*'     => 'integer',
        ]);

        $accesorio = Accesorio::with('imagenes')->findOrFail($id);

        DB::transaction(function () use ($request, $accesorio) {

            // 1) Datos base
            $accesorio->update([
                'titulo'       => $request->titulo,
                'descripcion'  => $request->descripcion,
                'precio'       => $request->precio,
                'stock'        => $request->stock,
                'categoria_id' => $request->categoria_id,
            ]);

            // 2) Borrar seleccionadas
            if ($request->filled('borrar')) {
                $aBorrar = ImagenAccesorio::where('accesorio_id', $accesorio->id)
                    ->whereIn('id', $request->borrar)->get();

                foreach ($aBorrar as $img) {
                    if ($img->ruta && Storage::disk('public')->exists($img->ruta)) {
                        Storage::disk('public')->delete($img->ruta);
                    }
                    $img->delete();
                }
            }

            // 3) Subir nuevas (la primera será candidata a principal si no marcás otra)
            $primeraNueva = null;
            if ($request->hasFile('imagenes')) {
                foreach ($request->file('imagenes') as $i => $file) {
                    $ruta = $file->store('accesorios', 'public');
                    $ruta = ltrim(str_replace('public/', '', $ruta), '/');

                    $nueva = ImagenAccesorio::create([
                        'ruta'         => $ruta,
                        'accesorio_id' => $accesorio->id,
                        'es_principal' => false,
                    ]);

                    if ($i === 0) {
                        $primeraNueva = $nueva; // candidata
                    }
                }
            }

            // 4) Resolver principal
            $principalId = $request->input('principal'); // radio de la vista

            if (!$principalId && $primeraNueva) {
                $principalId = $primeraNueva->id; // si no marcaste, usamos la primera nueva
            }

            if ($principalId) {
                ImagenAccesorio::where('accesorio_id', $accesorio->id)->update(['es_principal' => false]);

                $imgPrincipal = ImagenAccesorio::where('accesorio_id', $accesorio->id)
                    ->where('id', $principalId)->first();

                if ($imgPrincipal) {
                    $imgPrincipal->update(['es_principal' => true]);
                    $accesorio->update(['ruta_imagen' => $imgPrincipal->ruta]);
                }
            } else {
                // si no quedó ninguna como principal, intenta mantener la que exista
                $imgPrincipal = $accesorio->imagenes()->where('es_principal', true)->first();
                $accesorio->update(['ruta_imagen' => $imgPrincipal?->ruta]);
            }
        });

        return redirect()->route('accesorios.index')->with('success', 'Accesorio actualizado correctamente.');
    }

    public function destroy($id)
    {
        $accesorio = Accesorio::with('imagenes')->findOrFail($id);

        DB::transaction(function () use ($accesorio) {
            foreach ($accesorio->imagenes as $img) {
                if ($img->ruta && Storage::disk('public')->exists($img->ruta)) {
                    Storage::disk('public')->delete($img->ruta);
                }
                $img->delete();
            }

            if ($accesorio->ruta_imagen && Storage::disk('public')->exists($accesorio->ruta_imagen)) {
                Storage::disk('public')->delete($accesorio->ruta_imagen);
            }

            $accesorio->delete();
        });

        return redirect()->route('accesorios.index')->with('success', 'Accesorio eliminado correctamente.');
    }

    // API opcional
    public function apiIndex()
    {
        return Accesorio::with('imagenes', 'categoria')->get();
    }

    public function apiShow($id)
    {
        $accesorio = Accesorio::with(['imagenes', 'categoria'])->findOrFail($id);

        return response()->json([
            'id'          => $accesorio->id,
            'titulo'      => $accesorio->titulo,
            'descripcion' => $accesorio->descripcion,
            'precio'      => $accesorio->precio,
            'stock'       => $accesorio->stock,
            'ruta_imagen' => $accesorio->ruta_imagen,
            'categoria'   => $accesorio->categoria,
            'imagenes'    => $accesorio->imagenes,
        ]);
    }
}
