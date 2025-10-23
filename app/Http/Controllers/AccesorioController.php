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
        $theme = $request->query('theme');

        $esAdmin = auth()->check() && strtolower((string) auth()->user()->Tipo_Usuario) === 'admin';
        $query = $esAdmin ? Accesorio::query() : Accesorio::where('ID_Usuario', auth()->user()->ID_Usuario);

        $query->whereHas('usuario');

        if ($request->filled('busqueda')) {
            $query->where('titulo', 'like', '%' . $request->busqueda . '%');
        }
        if ($request->filled('categoria_id')) {
            $query->where('categoria_id', $request->categoria_id);
        }

        $query->delEstilo($theme);

        $accesorios = $query->with(['usuario:ID_Usuario,Nombre','imagenes','categoria'])
            ->latest()
            ->paginate(8)
            ->appends($request->query());

        $categorias = Categoria::whereIn('nombre', ['Anillos', 'Collares', 'Aritos'])->get();

        return view('accesorios.index', compact('accesorios', 'categorias', 'theme'));
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
            'estilo'       => 'required|in:claro,oscuro',
        ]);

        $disk = config('filesystems.default');

        DB::transaction(function () use ($request, $disk) {
            $accesorio = Accesorio::create([
                'titulo'       => $request->titulo,
                'descripcion'  => $request->descripcion,
                'precio'       => $request->precio,
                'stock'        => $request->stock,
                'categoria_id' => $request->categoria_id,
                'ID_Usuario'   => auth()->user()->ID_Usuario,
                'estilo'       => $request->estilo,
            ]);

            if ($request->hasFile('imagenes')) {
                foreach ($request->file('imagenes') as $index => $imagen) {
                    $ruta = $imagen->store('accesorios', $disk);

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
            'principal'    => 'nullable|integer',
            'borrar'       => 'array',
            'borrar.*'     => 'integer',
            'estilo'       => 'required|in:claro,oscuro',
        ]);

        $disk = config('filesystems.default');
        $accesorio = Accesorio::with('imagenes')->findOrFail($id);

        DB::transaction(function () use ($request, $accesorio, $disk) {
            $accesorio->update([
                'titulo'       => $request->titulo,
                'descripcion'  => $request->descripcion,
                'precio'       => $request->precio,
                'stock'        => $request->stock,
                'categoria_id' => $request->categoria_id,
                'estilo'       => $request->estilo,
            ]);

            if ($request->filled('borrar')) {
                $aBorrar = ImagenAccesorio::where('accesorio_id', $accesorio->id)
                    ->whereIn('id', $request->borrar)->get();

                foreach ($aBorrar as $img) {
                    if ($img->ruta && Storage::disk($disk)->exists($img->ruta)) {
                        Storage::disk($disk)->delete($img->ruta);
                    }
                    $img->delete();
                }
            }

            $primeraNueva = null;
            if ($request->hasFile('imagenes')) {
                foreach ($request->file('imagenes') as $i => $file) {
                    $ruta = $file->store('accesorios', $disk);

                    $nueva = ImagenAccesorio::create([
                        'ruta'         => $ruta,
                        'accesorio_id' => $accesorio->id,
                        'es_principal' => false,
                    ]);

                    if ($i === 0) {
                        $primeraNueva = $nueva;
                    }
                }
            }

            $principalId = $request->input('principal');

            if (!$principalId && $primeraNueva) {
                $principalId = $primeraNueva->id;
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
                $imgPrincipal = $accesorio->imagenes()->where('es_principal', true)->first();
                $accesorio->update(['ruta_imagen' => $imgPrincipal?->ruta]);
            }
        });

        return redirect()->route('accesorios.index')->with('success', 'Accesorio actualizado correctamente.');
    }

    public function destroy($id)
    {
        $disk = config('filesystems.default');
        $accesorio = Accesorio::with('imagenes')->findOrFail($id);

        DB::transaction(function () use ($accesorio, $disk) {
            foreach ($accesorio->imagenes as $img) {
                if ($img->ruta && Storage::disk($disk)->exists($img->ruta)) {
                    Storage::disk($disk)->delete($img->ruta);
                }
                $img->delete();
            }

            if ($accesorio->ruta_imagen && Storage::disk($disk)->exists($accesorio->ruta_imagen)) {
                Storage::disk($disk)->delete($accesorio->ruta_imagen);
            }

            $accesorio->delete();
        });

        return redirect()->route('accesorios.index')->with('success', 'Accesorio eliminado correctamente.');
    }

    public function apiIndex(Request $request)
    {
        $theme = $request->query('theme');

        $query = Accesorio::with(['usuario:ID_Usuario,Nombre','imagenes','categoria'])
            ->whereHas('usuario')
            ->delEstilo($theme);

        if ($request->filled('categoria_id')) {
            $query->where('categoria_id', $request->categoria_id);
        }

        return $query->get();
    }

    public function apiShow($id)
    {
        $accesorio = Accesorio::with(['usuario:ID_Usuario,Nombre','imagenes','categoria'])
            ->whereHas('usuario')
            ->findOrFail($id);

        return response()->json([
            'id'          => $accesorio->id,
            'titulo'      => $accesorio->titulo,
            'descripcion' => $accesorio->descripcion,
            'precio'      => $accesorio->precio,
            'stock'       => $accesorio->stock,
            'ruta_imagen' => $accesorio->ruta_imagen,
            'categoria'   => $accesorio->categoria,
            'imagenes'    => $accesorio->imagenes,
            'estilo'      => $accesorio->estilo,
            'usuario'     => $accesorio->usuario,
        ]);
    }
}
