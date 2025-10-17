@extends('layouts.app')
@php use Illuminate\Support\Facades\Storage; @endphp

@section('content')
<div class="max-w-7xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-6 text-gray-800">Listado de prendas</h2>

    @if(session('success'))
        <div class="mb-4 p-3 bg-green-100 text-green-700 rounded">
            {{ session('success') }}
        </div>
    @endif

    @php
        // Usamos la misma lista de accesorios que en el controller (pasada como $soloAccesorios)
        $accesorios = $soloAccesorios ?? ['Collares', 'Anillos', 'Aritos'];
        $categoriaSeleccionada = $categorias->firstWhere('id', request('categoria_id'));
        $themeLocal = request('theme', $theme ?? 'light');
    @endphp

    @if($categoriaSeleccionada && in_array($categoriaSeleccionada->nombre, $accesorios))
        <div class="mb-4 p-3 bg-yellow-100 text-yellow-800 border border-yellow-300 rounded">
            Esta categoría corresponde a accesorios y no se muestran en esta sección.
        </div>
    @endif

    <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <form method="GET" class="flex flex-wrap gap-4 items-end">
            <div>
                <label class="block text-sm font-medium text-gray-600">Buscar por título</label>
                <input type="text" name="busqueda" value="{{ request('busqueda') }}"
                       class="border border-gray-300 rounded px-3 py-2 w-64 focus:ring-blue-500">
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-600">Categoría</label>
                <select name="categoria_id" class="border border-gray-300 rounded px-3 py-2">
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
                <label class="block text-sm font-medium text-gray-600">Género</label>
                <select name="genero_id" class="border border-gray-300 rounded px-3 py-2">
                    <option value="">Todos</option>
                    @foreach($generos as $g)
                        <option value="{{ $g->id }}" {{ request('genero_id') == $g->id ? 'selected' : '' }}>
                            {{ $g->nombre }}
                        </option>
                    @endforeach
                </select>
            </div>

            {{-- NUEVO: Filtro de Estilo (igual que en Accesorios) --}}
            <div>
                <label class="block text-sm font-medium text-gray-600">Estilo</label>
                <select name="estilo" class="border border-gray-300 rounded px-3 py-2">
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

        {{-- Toggle de tema por URL, igual a Accesorios --}}
        <div class="inline-flex rounded overflow-hidden border">
            <a href="{{ request()->fullUrlWithQuery(['theme' => 'light']) }}"
               class="px-4 py-2 text-sm {{ ($themeLocal==='light' || $themeLocal==='claro') ? 'bg-gray-900 text-white' : 'bg-white text-gray-700' }}">
                Claro
            </a>
            <a href="{{ request()->fullUrlWithQuery(['theme' => 'dark']) }}"
               class="px-4 py-2 text-sm {{ ($themeLocal==='dark' || $themeLocal==='oscuro') ? 'bg-gray-900 text-white' : 'bg-white text-gray-700' }}">
                Oscuro
            </a>
        </div>

        <a href="{{ route('ropas.create') }}"
           class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition text-center">
            + Agregar prenda
        </a>
    </div>

    <div class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-300 rounded shadow-sm text-sm">
            <thead class="bg-gray-100 text-gray-700">
                <tr>
                    <th class="px-4 py-2 border">Imagen(es)</th>
                    <th class="px-4 py-2 border">Título</th>
                    <th class="px-4 py-2 border">Precio</th>
                    <th class="px-4 py-2 border">Categoría</th>
                    <th class="px-4 py-2 border">Género</th>
                    <th class="px-4 py-2 border">Estilo</th>
                    <th class="px-4 py-2 border">Stock por Talla</th>
                    <th class="px-4 py-2 border">Acciones</th>
                </tr>
            </thead>
            <tbody>
                @forelse($ropas as $ropa)
                    <tr class="border-t align-top">
                        <td class="px-4 py-2 border">
                            @if($ropa->imagenes->count())
                                <div class="flex flex-wrap gap-2 max-w-[260px]">
                                    @foreach($ropa->imagenes as $img)
                                        <img src="{{ Storage::disk(config('filesystems.default'))->url($img->ruta) }}"
                                             onerror="this.onerror=null;this.src='{{ asset('images/placeholder.png') }}';"
                                             class="w-16 h-16 object-cover rounded shadow"
                                             alt="{{ $ropa->titulo }}">
                                    @endforeach
                                </div>
                            @else
                                <img src="{{ asset('images/placeholder.png') }}"
                                     class="w-16 h-16 object-cover rounded shadow inline-block"
                                     alt="Sin imagen">
                            @endif
                        </td>

                        <td class="px-4 py-2 border">{{ $ropa->titulo }}</td>
                        <td class="px-4 py-2 border">${{ number_format($ropa->precio, 2, ',', '.') }}</td>
                        <td class="px-4 py-2 border">{{ $ropa->categoria->nombre ?? '-' }}</td>
                        <td class="px-4 py-2 border">{{ $ropa->genero->nombre ?? '-' }}</td>
                        <td class="px-4 py-2 border uppercase text-xs">{{ $ropa->estilo }}</td>

                        <td class="px-4 py-2 border">
                            @forelse($ropa->tallas as $t)
                                <div>{{ $t->nombre }}: {{ $t->pivot->cantidad }}</div>
                            @empty
                                <span class="text-gray-400 italic">Sin stock</span>
                            @endforelse
                        </td>

                        <td class="px-4 py-2 border text-center space-x-2">
                            <a href="{{ route('ropas.edit', $ropa->id) }}"
                               class="text-blue-600 hover:underline">Editar</a>
                            <form action="{{ route('ropas.destroy', $ropa->id) }}" method="POST" class="inline">
                                @csrf
                                @method('DELETE')
                                <button type="submit"
                                        onclick="return confirm('¿Estás seguro de eliminar esta prenda?')"
                                        class="text-red-600 hover:underline">
                                    Eliminar
                                </button>
                            </form>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="8" class="text-center px-4 py-6 text-gray-500 italic">
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
