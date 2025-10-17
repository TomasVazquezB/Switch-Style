@extends('layouts.app')
@php use Illuminate\Support\Facades\Storage; @endphp

@section('content')
@php
    $accesorios = ['Collares', 'Anillos', 'Aritos'];
    $categoriaSeleccionada = $categorias->firstWhere('id', request('categoria_id'));
    $themeLocal = request('theme', $theme ?? (localStorage()['theme'] ?? 'light'));
@endphp

{{-- Sincroniza ?theme= con html.dark y localStorage (puedes quitarlo si ya lo haces en el layout) --}}
<script>
  (function () {
    try {
      var params = new URLSearchParams(window.location.search);
      var qTheme = params.get('theme'); // 'light' | 'dark' | null
      var saved = localStorage.getItem('theme') || 'light';
      var finalTheme = qTheme || saved;
      var root = document.documentElement;
      if (finalTheme === 'dark' || finalTheme === 'oscuro') {
        root.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        root.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    } catch (e) {}
  })();
</script>

<div class="max-w-7xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Listado de prendas</h2>

    @if(session('success'))
        <div class="mb-4 p-3 rounded border
                    bg-green-100 text-green-700 border-green-200
                    dark:bg-green-900/30 dark:text-green-300 dark:border-green-800">
            {{ session('success') }}
        </div>
    @endif

    @if($categoriaSeleccionada && in_array($categoriaSeleccionada->nombre, $accesorios))
        <div class="mb-4 p-3 rounded border
                    bg-yellow-100 text-yellow-800 border-yellow-300
                    dark:bg-yellow-900/30 dark:text-yellow-200 dark:border-yellow-800">
            Esta categoría corresponde a accesorios y no se muestran en esta sección.
        </div>
    @endif

    <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <form method="GET" class="flex flex-wrap gap-4 items-end">
            <div>
                <label class="block text-sm font-medium text-gray-600 dark:text-gray-300">Buscar por título</label>
                <input type="text" name="busqueda" value="{{ request('busqueda') }}"
                       class="border border-gray-300 dark:border-gray-700 rounded px-3 py-2 w-64
                              bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                              placeholder-gray-400 focus:ring-blue-500 focus:outline-none">
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-600 dark:text-gray-300">Categoría</label>
                <select name="categoria_id"
                        class="border border-gray-300 dark:border-gray-700 rounded px-3 py-2
                               bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                    <option value="">Todas</option>
                    @foreach($categorias as $c)
                        @if(!in_array($c->nombre, $accesorios))
                            <option value="{{ $c->id }}" {{ request('categoria_id') == $c->id ? 'selected' : '' }}>
                                {{ $c->nombre }}
                            </option>
                        @endif
                    @endforeach
                </select>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-600 dark:text-gray-300">Género</label>
                <select name="genero_id"
                        class="border border-gray-300 dark:border-gray-700 rounded px-3 py-2
                               bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                    <option value="">Todos</option>
                    @foreach($generos as $g)
                        <option value="{{ $g->id }}" {{ request('genero_id') == $g->id ? 'selected' : '' }}>
                            {{ $g->nombre }}
                        </option>
                    @endforeach
                </select>
            </div>

            {{-- 🔹 Nuevo filtro de Estilo --}}
            <div>
                <label class="block text-sm font-medium text-gray-600 dark:text-gray-300">Estilo</label>
                <select name="estilo"
                        class="border border-gray-300 dark:border-gray-700 rounded px-3 py-2
                               bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                    <option value="">Todos</option>
                    <option value="claro" {{ request('estilo') === 'claro' ? 'selected' : '' }}>Claro</option>
                    <option value="oscuro" {{ request('estilo') === 'oscuro' ? 'selected' : '' }}>Oscuro</option>
                </select>
            </div>

            <button type="submit"
                    class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                Filtrar
            </button>
        </form>

        {{-- 🔹 Toggle rápido Claro / Oscuro (usa ?theme=...) --}}
        <div class="inline-flex rounded overflow-hidden border border-gray-300 dark:border-gray-700">
            <a href="{{ request()->fullUrlWithQuery(['theme' => 'light']) }}"
               class="px-4 py-2 text-sm
                      {{ ($themeLocal==='light' || $themeLocal==='claro')
                          ? 'bg-gray-900 text-white'
                          : 'bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-200' }}">
                Claro
            </a>
            <a href="{{ request()->fullUrlWithQuery(['theme' => 'dark']) }}"
               class="px-4 py-2 text-sm
                      {{ ($themeLocal==='dark' || $themeLocal==='oscuro')
                          ? 'bg-gray-900 text-white'
                          : 'bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-200' }}">
                Oscuro
            </a>
        </div>

        <a href="{{ route('ropas.create') }}"
           class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition text-center">
            + Agregar prenda
        </a>
    </div>

    <div class="overflow-x-auto">
        <table class="min-w-full text-sm
                       bg-white dark:bg-gray-800
                       border border-gray-300 dark:border-gray-700 rounded shadow-sm">
            <thead class="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                <tr>
                    <th class="px-4 py-2 border border-gray-200 dark:border-gray-700">Imagen(es)</th>
                    <th class="px-4 py-2 border border-gray-200 dark:border-gray-700">Título</th>
                    <th class="px-4 py-2 border border-gray-200 dark:border-gray-700">Precio</th>
                    <th class="px-4 py-2 border border-gray-200 dark:border-gray-700">Categoría</th>
                    <th class="px-4 py-2 border border-gray-200 dark:border-gray-700">Género</th>
                    <th class="px-4 py-2 border border-gray-200 dark:border-gray-700">Estilo</th>
                    <th class="px-4 py-2 border border-gray-200 dark:border-gray-700">Stock por Talla</th>
                    <th class="px-4 py-2 border border-gray-200 dark:border-gray-700">Acciones</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                @forelse($ropas as $ropa)
                    <tr class="align-top hover:bg-gray-50 dark:hover:bg-gray-900/40">
                        <td class="px-4 py-2 border border-gray-200 dark:border-gray-700">
                            @if($ropa->imagenes->count())
                                <div class="flex flex-wrap gap-2 max-w-[260px]">
                                    @foreach($ropa->imagenes as $img)
                                        <img src="{{ Storage::disk(config('filesystems.default'))->url($img->ruta) }}"
                                             onerror="this.onerror=null;this.src='{{ asset('images/placeholder.png') }}';"
                                             class="w-16 h-16 object-cover rounded shadow
                                                    border border-gray-200 dark:border-gray-700"
                                             alt="{{ $ropa->titulo }}">
                                    @endforeach
                                </div>
                            @else
                                <img src="{{ asset('images/placeholder.png') }}"
                                     class="w-16 h-16 object-cover rounded shadow
                                            border border-gray-200 dark:border-gray-700 inline-block"
                                     alt="Sin imagen">
                            @endif
                        </td>

                        <td class="px-4 py-2 border border-gray-200 dark:border-gray-700
                                   text-gray-900 dark:text-gray-100">
                            {{ $ropa->titulo }}
                        </td>

                        <td class="px-4 py-2 border border-gray-200 dark:border-gray-700
                                   text-gray-900 dark:text-gray-100">
                            ${{ number_format($ropa->precio, 2, ',', '.') }}
                        </td>

                        <td class="px-4 py-2 border border-gray-200 dark:border-gray-700
                                   text-gray-700 dark:text-gray-300">
                            {{ $ropa->categoria->nombre ?? '-' }}
                        </td>

                        <td class="px-4 py-2 border border-gray-200 dark:border-gray-700
                                   text-gray-700 dark:text-gray-300">
                            {{ $ropa->genero->nombre ?? '-' }}
                        </td>

                        <td class="px-4 py-2 border border-gray-200 dark:border-gray-700
                                   text-gray-700 dark:text-gray-300 uppercase text-xs">
                            {{ $ropa->estilo }}
                        </td>

                        <td class="px-4 py-2 border border-gray-200 dark:border-gray-700">
                            @forelse($ropa->tallas as $t)
                                <div class="text-gray-800 dark:text-gray-200">
                                    {{ $t->nombre }}: {{ $t->pivot->cantidad }}
                                </div>
                            @empty
                                <span class="text-gray-400 dark:text-gray-500 italic">Sin stock</span>
                            @endforelse
                        </td>

                        <td class="px-4 py-2 border border-gray-200 dark:border-gray-700 text-center space-x-2">
                            <a href="{{ route('ropas.edit', $ropa->id) }}"
                               class="text-blue-600 dark:text-blue-400 hover:underline">Editar</a>
                            <form action="{{ route('ropas.destroy', $ropa->id) }}" method="POST" class="inline">
                                @csrf
                                @method('DELETE')
                                <button type="submit"
                                        onclick="return confirm('¿Estás seguro de eliminar esta prenda?')"
                                        class="text-red-600 dark:text-red-400 hover:underline">
                                    Eliminar
                                </button>
                            </form>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="8"
                            class="text-center px-4 py-6 text-gray-500 dark:text-gray-400 italic">
                            No hay prendas que coincidan.
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>

        <div class="mt-6">
            {{ $ropas->appends(request()->query())->links() }}
        </div>
    </div>
</div>
@endsection
