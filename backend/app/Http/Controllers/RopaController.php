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

        // Eager loading de relaciones
        $ropas = $query->with(['imagenes', 'categoria', 'genero', 'tallas'])
                       ->latest()
                       ->paginate(8)
                       ->appends($request->query());

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

        $disk = config('filesystems.default');

        DB::transaction(function () use ($request, $disk) {
            $ropa = Ropa::create([
                'titulo'       => $request->titulo,
                'descripcion'  => $request->descripcion,
                'precio'       => $request->precio,
                'categoria_id' => $request->categoria_id,
                'genero_id'    => $request->genero_id,
                'ID_Usuario'   => auth()->id(),
            ]);

            // Stock por talla (solo las > 0)
            foreach ($request->tallas as $tallaData) {
                $cant = (int)($tallaData['cantidad'] ?? 0);
                if ($cant > 0) {
                    $ropa->tallas()->attach($tallaData['id'], ['cantidad' => $cant]);
                }
            }

            // Imágenes: guardar SIN marcar principal
            if ($request->hasFile('imagenes')) {
                foreach ($request->file('imagenes') as $imagen) {
                    // Guarda en el disco por defecto (S3/R2) bajo carpeta 'ropa'
                    $ruta = $imagen->store('ropa', $disk); // p.ej. ropa/abc.jpg
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
            'borrar'             => 'sometimes|array',
            'borrar.*'           => 'integer|exists:imagenes,id',
        ]);

        $disk = config('filesystems.default');

        DB::transaction(function () use ($request, $ropa, $disk) {
            // Datos base
            $ropa->update([
                'titulo'       => $request->titulo,
                'descripcion'  => $request->descripcion,
                'precio'       => $request->precio,
                'categoria_id' => $request->categoria_id,
                'genero_id'    => $request->genero_id,
            ]);

            // Sync de tallas
            $syncData = [];
            foreach ($request->tallas as $tallaData) {
                $cant = (int)($tallaData['cantidad'] ?? 0);
                if ($cant > 0) {
                    $syncData[$tallaData['id']] = ['cantidad' => $cant];
                }
            }
            $ropa->tallas()->sync($syncData);

            // Eliminar imágenes marcadas
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

            // Subir nuevas imágenes
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
        $query = Ropa::with(['imagenes', 'categoria', 'genero'])
            ->whereHas('categoria', function ($q) {
                $q->whereNotIn('nombre', ['Anillos', 'Collares', 'Aritos']);
            });

        // Filtro por nombre de género (como "Hombre")
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
