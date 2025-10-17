<?php

namespace App\Http\Controllers;

use App\Models\Ropa;
use App\Models\Categoria;
use App\Models\Genero;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class RopaController extends Controller
{
    public function index(Request $request)
    {
        // 1) Tema UI (toggle por URL). Default 'light' para que tu blade tenga valor seguro.
        $theme = $request->query('theme', 'light');

        // 2) Base query: admin ve todo; resto ve sus propias prendas.
        $esAdmin = auth()->check() && strtolower((string) auth()->user()->Tipo_Usuario) === 'admin';
        $query   = $esAdmin ? Ropa::query() : Ropa::propias();

        // 3) Excluir categorías de accesorios (defensa del lado servidor).
        $query->whereHas('categoria', function ($q) {
            $q->whereNotIn('nombre', ['Collares', 'Aritos', 'Anillos']);
        });

        // 4) Filtros básicos
        if ($request->filled('busqueda')) {
            $query->where('titulo', 'like', '%' . $request->busqueda . '%');
        }

        if ($request->filled('categoria_id')) {
            $query->where('categoria_id', $request->categoria_id);
        }

        if ($request->filled('genero_id')) {
            $query->where('genero_id', $request->genero_id);
        }

        // 5) Filtro por estilo (claro/oscuro)
        //    Toma el select 'estilo' y, si viene vacío, intenta con el 'theme' de la URL.
        $estilo = $request->get('estilo') ?: $theme;
        if ($estilo) {
            // Usa tu scope local 'delEstilo' si existe; si no, podés reemplazar por ->where('estilo', $estilo)
            $query->delEstilo($estilo);
        }

        // 6) Eager loading + orden + paginación con appends
        $ropas = $query->with(['imagenes', 'categoria', 'genero', 'tallas'])
            ->latest()
            ->paginate(8)
            ->appends($request->query());

        // 7) Datos para selects (categorías sin accesorios; géneros todos)
        $categorias = Categoria::whereNotIn('nombre', ['Collares', 'Aritos', 'Anillos'])
            ->orderBy('nombre')
            ->get();

        $generos = Genero::orderBy('nombre')->get();

        return view('ropas.index', compact('ropas', 'categorias', 'generos', 'theme'));
    }

    public function create()
    {
        return view('ropas.create', [
            'categorias' => Categoria::whereNotIn('nombre', ['Anillos', 'Collares', 'Aritos'])
                ->orderBy('nombre')
                ->get(),
            'tallas'  => \App\Models\Talla::orderBy('nombre')->get(),
            'generos' => \App\Models\Genero::orderBy('nombre')->get(),
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
            'estilo'             => 'required|in:claro,oscuro',
            'tallas'             => 'required|array',
            'tallas.*.id'        => 'required|exists:tallas,id',
            'tallas.*.cantidad'  => 'required|integer|min:0',
            'imagenes.*'         => 'nullable|image|max:2048',
        ]);

        $disk = config('filesystems.default');

        DB::transaction(function () use ($request, $disk) {
            $ropa = Ropa::create([
                'titulo'       => $request->titulo,
                'descripcion'  => $request->descripcion,
                'precio'       => $request->precio,
                'categoria_id' => $request->categoria_id,
                'genero_id'    => $request->genero_id,
                'estilo'       => $request->estilo,
                'ID_Usuario'   => auth()->user()->ID_Usuario,
            ]);

            foreach ($request->tallas as $tallaData) {
                $cant = (int)($tallaData['cantidad'] ?? 0);
                if ($cant > 0) {
                    $ropa->tallas()->attach($tallaData['id'], ['cantidad' => $cant]);
                }
            }

            if ($request->hasFile('imagenes')) {
                foreach ($request->file('imagenes') as $imagen) {
                    $ruta = $imagen->store('ropa', $disk);
                    $ropa->imagenes()->create(['ruta' => $ruta]);
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
            'categorias' => Categoria::whereNotIn('nombre', ['Anillos', 'Collares', 'Aritos'])
                ->orderBy('nombre')
                ->get(),
            'tallas'  => \App\Models\Talla::orderBy('nombre')->get(),
            'generos' => \App\Models\Genero::orderBy('nombre')->get(),
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
            'estilo'             => 'required|in:claro,oscuro',
            'tallas'             => 'required|array',
            'tallas.*.id'        => 'required|exists:tallas,id',
            'tallas.*.cantidad'  => 'required|integer|min:0',
            'imagenes.*'         => 'nullable|image|max:2048',
            'borrar'             => 'sometimes|array',
            'borrar.*'           => 'integer|exists:imagenes,id',
        ]);

        $disk = config('filesystems.default');

        DB::transaction(function () use ($request, $ropa, $disk) {
            $ropa->update([
                'titulo'       => $request->titulo,
                'descripcion'  => $request->descripcion,
                'precio'       => $request->precio,
                'categoria_id' => $request->categoria_id,
                'genero_id'    => $request->genero_id,
                'estilo'       => $request->estilo,
            ]);

            // sync de tallas con cantidades (>0)
            $syncData = [];
            foreach ($request->tallas as $tallaData) {
                $cant = (int)($tallaData['cantidad'] ?? 0);
                if ($cant > 0) {
                    $syncData[$tallaData['id']] = ['cantidad' => $cant];
                }
            }
            $ropa->tallas()->sync($syncData);

            // borrar imágenes marcadas
            $idsBorrar = (array) $request->input('borrar', []);
            if (!empty($idsBorrar)) {
                $imagenes = $ropa->imagenes()->whereIn('id', $idsBorrar)->get();
                foreach ($imagenes as $img) {
                    if ($img->ruta && Storage::disk($disk)->exists($img->ruta)) {
                        Storage::disk($disk)->delete($img->ruta);
                    }
                    $img->delete();
                }
            }

            // nuevas imágenes
            if ($request->hasFile('imagenes')) {
                foreach ($request->file('imagenes') as $imagen) {
                    $ruta = $imagen->store('ropa', $disk);
                    $ropa->imagenes()->create(['ruta' => $ruta]);
                }
            }
        });

        return redirect()->route('ropas.index')->with('success', 'Prenda actualizada.');
    }

    public function destroy(Ropa $ropa)
    {
        $disk = config('filesystems.default');

        $ropa->load('imagenes');
        foreach ($ropa->imagenes as $img) {
            if ($img->ruta && Storage::disk($disk)->exists($img->ruta)) {
                Storage::disk($disk)->delete($img->ruta);
            }
            $img->delete();
        }

        if ($ropa->ruta_imagen && Storage::disk($disk)->exists($ropa->ruta_imagen)) {
            Storage::disk($disk)->delete($ropa->ruta_imagen);
        }

        $ropa->tallas()->detach();
        $ropa->delete();

        return redirect()->route('ropas.index')->with('success', 'Prenda eliminada.');
    }

    public function apiIndex(Request $request)
    {
        $theme = $request->query('theme', 'light');

        $query = Ropa::with(['imagenes', 'categoria', 'genero'])
            ->whereHas('categoria', function ($q) {
                $q->whereNotIn('nombre', ['Anillos', 'Collares', 'Aritos']);
            });

        $estilo = $request->get('estilo') ?: $theme;
        if ($estilo) {
            $query->delEstilo($estilo);
        }

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
