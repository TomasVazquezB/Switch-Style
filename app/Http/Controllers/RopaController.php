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
            'generos' => Genero::all(),
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
            'titulo'             => 'required|string|max:255',
            'descripcion'        => 'required|string',
            'precio'             => 'required|numeric',
            'categoria_id'       => 'required|exists:categorias,id',
            'genero_id'          => 'required|exists:generos,id',
            'tallas'             => 'required|array',
            'tallas.*.id'        => 'required|exists:tallas,id',
            'tallas.*.cantidad'  => 'required|integer|min:0',
            'imagenes.*'         => 'nullable|image|max:2048',
        ]);

        DB::transaction(function () use ($request) {
            $ropa = Ropa::create([
                'titulo'       => $request->titulo,
                'descripcion'  => $request->descripcion,
                'precio'       => $request->precio,
                'categoria_id' => $request->categoria_id,
                'genero_id'    => $request->genero_id,
                'ID_Usuario'   => auth()->id(),
            ]);

            // Stock por talla (solo > 0)
            foreach ($request->tallas as $tallaData) {
                $cant = (int)($tallaData['cantidad'] ?? 0);
                if ($cant > 0) {
                    $ropa->tallas()->attach($tallaData['id'], ['cantidad' => $cant]);
                }
            }

            // Imágenes: primera como principal (igual que accesorios)
            if ($request->hasFile('imagenes')) {
                foreach ($request->file('imagenes') as $index => $imagen) {
                    $ruta = $imagen->store('ropa', 'public');               // public/ropa/xxx.jpg
                    $ruta = ltrim(str_replace('public/', '', $ruta), '/');  // ropa/xxx.jpg

                    $ropa->imagenes()->create([
                        'ruta'         => $ruta,
                        'es_principal' => $index === 0,
                    ]);

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
        $ropa->load(['tallas', 'imagenes']);

        return view('ropas.edit', [
            'ropa'       => $ropa,
            'categorias' => Categoria::whereNotIn('nombre', ['Anillos', 'Collares', 'Aritos'])->get(),
            'tallas'     => \App\Models\Talla::all(),
            'generos'    => \App\Models\Genero::all(),
        ]);
    }

    public function update(Request $request, Ropa $ropa)
    {
        $request->validate([
            'titulo'             => 'required|string|max:255',
            'descripcion'        => 'required|string',
            'precio'             => 'required|numeric',
            'categoria_id'       => 'required|exists:categorias,id',
            'genero_id'          => 'required|exists:generos,id',
            'tallas'             => 'required|array',
            'tallas.*.id'        => 'required|exists:tallas,id',
            'tallas.*.cantidad'  => 'required|integer|min:0',
            'imagenes.*'         => 'nullable|image|max:2048',
            'principal'          => 'nullable|integer',   // <- igual que accesorios
            'borrar'             => 'array',
            'borrar.*'           => 'integer',
        ]);

        $ropa->load('imagenes');

        DB::transaction(function () use ($request, $ropa) {
            // 1) Datos base
            $ropa->update([
                'titulo'       => $request->titulo,
                'descripcion'  => $request->descripcion,
                'precio'       => $request->precio,
                'categoria_id' => $request->categoria_id,
                'genero_id'    => $request->genero_id,
            ]);

            // 2) Stock por talla (solo > 0)
            $syncData = [];
            foreach ($request->tallas as $t) {
                $cant = (int)($t['cantidad'] ?? 0);
                if ($cant > 0) {
                    $syncData[$t['id']] = ['cantidad' => $cant];
                }
            }
            $ropa->tallas()->sync($syncData);

            // 3) Borrar imágenes marcadas
            if ($request->filled('borrar')) {
                $aBorrar = $ropa->imagenes()->whereIn('id', $request->borrar)->get();
                foreach ($aBorrar as $img) {
                    if ($img->ruta && Storage::disk('public')->exists($img->ruta)) {
                        Storage::disk('public')->delete($img->ruta);
                    }
                    $img->delete();
                }
                $ropa->unsetRelation('imagenes');
                $ropa->load('imagenes');
            }

            // 4) Subir nuevas (candidata a principal: la primera nueva si no elegís otra)
            $primeraNueva = null;
            if ($request->hasFile('imagenes')) {
                foreach ($request->file('imagenes') as $i => $file) {
                    $ruta = $file->store('ropa', 'public');
                    $ruta = ltrim(str_replace('public/', '', $ruta), '/');

                    $nueva = $ropa->imagenes()->create([
                        'ruta'         => $ruta,
                        'es_principal' => false,
                    ]);

                    if ($i === 0) {
                        $primeraNueva = $nueva;
                    }
                }
                $ropa->unsetRelation('imagenes');
                $ropa->load('imagenes');
            }

            // 5) Resolver principal (igual que accesorios)
            $principalId = $request->input('principal');
            if (!$principalId && $primeraNueva) {
                $principalId = $primeraNueva->id;
            }

            if ($principalId) {
                $ropa->imagenes()->update(['es_principal' => false]);

                $imgPrincipal = $ropa->imagenes()->where('id', $principalId)->first();
                if ($imgPrincipal) {
                    $imgPrincipal->update(['es_principal' => true]);
                    $ropa->update(['ruta_imagen' => $imgPrincipal->ruta]);
                }
            } else {
                // Si no quedó ninguna marcada, mantener alguna existente
                $imgPrincipal = $ropa->imagenes()->where('es_principal', true)->first()
                    ?: $ropa->imagenes()->first();
                $ropa->update(['ruta_imagen' => $imgPrincipal?->ruta]);
                if ($imgPrincipal && !$imgPrincipal->es_principal) {
                    $imgPrincipal->update(['es_principal' => true]);
                }
            }
        });

        return redirect()->route('ropas.index')->with('success', 'Prenda actualizada.');
    }

    public function destroy(Ropa $ropa)
    {
        // Borrar imágenes asociadas (archivo + registro)
        $ropa->load('imagenes');
        foreach ($ropa->imagenes as $img) {
            if ($img->ruta && Storage::disk('public')->exists($img->ruta)) {
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

    // ---- API opcionales ----
    public function apiIndex(Request $request)
    {
        $query = Ropa::with(['imagenes', 'categoria', 'genero'])
            ->whereHas('categoria', function ($q) {
                $q->whereNotIn('nombre', ['Anillos', 'Collares', 'Aritos']);
            });

        if ($request->filled('genero')) {
            $nombreGenero = strtolower($request->genero);
            $query->whereHas('genero', function ($q) use ($nombreGenero) {
                $q->whereRaw('LOWER(nombre) = ?', [$nombreGenero]);
            });
        }

        if ($request->filled('precio_min')) {
            $query->where('precio', '>=', $request->precio_min);
        }

        if ($request->filled('precio_max')) {
            $query->where('precio', '<=', $request->precio_max);
        }

        if ($request->filled('talla')) {
            $query->whereHas('tallas', function ($q) use ($request) {
                $q->where('nombre', $request->talla);
            });
        }

        return $query->get();
    }

    public function apiShow($id)
    {
        try {
            $ropa = Ropa::with(['imagenes', 'categoria', 'genero', 'tallas'])->findOrFail($id);
            return response()->json($ropa);
        } catch (\Exception $e) {
            return response()->json([
                'error'   => 'Producto no encontrado',
                'detalle' => $e->getMessage(),
            ], 500);
        }
    }
}
