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
        $theme = $request->query('theme', 'light');
        $t = strtolower((string) $theme);
        $themeStyle = $t === 'dark' || $t === 'oscuro' ? 'oscuro' : ($t === 'light' || $t === 'claro' ? 'claro' : null);

        $esAdmin = auth()->check() && strtolower((string) auth()->user()->Tipo_Usuario) === 'admin';
        $query   = $esAdmin ? Ropa::query() : Ropa::propias();

        $query->whereHas('usuario');
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

        $estilo = $request->get('estilo') ?: $themeStyle;
        if ($estilo) {
            if (method_exists(new \App\Models\Ropa, 'scopeDelEstilo')) {
                $query->delEstilo($estilo);
            } else {
                $query->where('estilo', $estilo);
            }
        }

        $ropas = $query->with(['usuario:ID_Usuario,Nombre','imagenes','categoria','genero','tallas'])
            ->latest()
            ->paginate(8)
            ->appends($request->query());

        $categorias = Categoria::whereNotIn('nombre', ['Collares', 'Aritos', 'Anillos'])->orderBy('nombre')->get();
        $generos = Genero::orderBy('nombre')->get();

        return view('ropas.index', compact('ropas', 'categorias', 'generos', 'theme'));
    }

    public function create()
    {
        return view('ropas.create', [
            'categorias' => Categoria::whereNotIn('nombre', ['Anillos', 'Collares', 'Aritos'])->orderBy('nombre')->get(),
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
            'categorias' => Categoria::whereNotIn('nombre', ['Anillos', 'Collares', 'Aritos'])->orderBy('nombre')->get(),
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

            $syncData = [];
            foreach ($request->tallas as $tallaData) {
                $cant = (int)($tallaData['cantidad'] ?? 0);
                if ($cant > 0) {
                    $syncData[$tallaData['id']] = ['cantidad' => $cant];
                }
            }
            $ropa->tallas()->sync($syncData);

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
    $theme = strtolower((string) $request->query('theme', ''));
    $themeStyle = $theme === 'dark' || $theme === 'oscuro' ? 'oscuro'
                 : ($theme === 'light' || $theme === 'claro' ? 'claro' : null);

    $q = Ropa::with(['usuario:ID_Usuario,Nombre','imagenes','categoria','genero','tallas'])
        ->whereHas('usuario')
        ->whereHas('categoria', fn($z) => $z->whereNotIn('nombre', ['Anillos','Collares','Aritos']));

    // estilo (claro/oscuro)
    $estilo = $request->input('estilo') ?: $themeStyle;
    if ($estilo) $q->where('estilo', $estilo);

    // genero por nombre
    if ($request->filled('genero')) {
        $gen = $request->input('genero');
        $q->whereHas('genero', fn($z) => $z->whereRaw('LOWER(nombre) = ?', [mb_strtolower($gen,'UTF-8')]));
    }

    // categorias: array o CSV, por nombre
    if ($request->filled('categorias')) {
        $cats = is_array($request->categorias) ? $request->categorias : explode(',', $request->categorias);
        $cats = array_map(fn($v)=>mb_strtolower(trim($v),'UTF-8'), $cats);
        $q->whereHas('categoria', fn($z) => $z->whereIn(DB::raw('LOWER(nombre)'), $cats));
    }

    // tallas: array o CSV, por nombre, con stock
    if ($request->filled('tallas')) {
        $tallas = is_array($request->tallas) ? $request->tallas : explode(',', $request->tallas);
        $tallas = array_map(fn($v)=>mb_strtolower(trim($v),'UTF-8'), $tallas);
        $q->whereHas('tallas', fn($z) => $z->whereIn(DB::raw('LOWER(nombre)'), $tallas)
                                          ->where('ropa_talla.cantidad','>',0));
    }

    // precio (opcional)
    if ($request->filled('precio_min')) $q->where('precio','>=',(float)$request->precio_min);
    if ($request->filled('precio_max')) $q->where('precio','<=',(float)$request->precio_max);

    // orden
    match ($request->input('orden')) {
        'precio_asc'  => $q->orderBy('precio','asc'),
        'precio_desc' => $q->orderBy('precio','desc'),
        default       => $q->latest(),
    };

    return response()->json($q->get());
}


    public function apiShow($id)
    {
        try {
            $ropa = Ropa::with(['usuario:ID_Usuario,Nombre','imagenes','categoria','genero','tallas'])
                ->whereHas('usuario')
                ->findOrFail($id);

            return response()->json($ropa);
        } catch (\Exception $e) {
            return response()->json([
                'error'   => 'Producto no encontrado',
                'detalle' => $e->getMessage(),
            ], 500);
        }
    }
}
