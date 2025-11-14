@extends('layouts.app')
@php use Illuminate\Support\Facades\Storage; @endphp

@section('content')
<div class="max-w-7xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-6 text-gray-800">Listado de accesorios</h2>

    @if(session('success'))
        <div class="mb-4 p-3 bg-green-100 text-green-700 rounded">
            {{ session('success') }}
        </div>
    @endif

    @php
        $soloAccesorios = [
            'Anillos',
            'Collares',
            'Aritos',
            'Carteras y Mochilas',
            'Billeteras',
            'Cinturones',
            'Gorras',
        ];

        $themeLocal = request('theme', 'light');
        $paramsBase = request()->except(['page']);
    @endphp

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
                        @if(in_array($c->nombre, $soloAccesorios))
                            <option value="{{ $c->id }}" {{ request('categoria_id') == $c->id ? 'selected' : '' }}>
                                {{ $c->nombre }}
                            </option>
                        @endif
                    @endforeach
                </select>
            </div>

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

        <div class="flex items-center gap-3">
            <div class="inline-flex rounded overflow-hidden border">
                <a href="{{ route('accesorios.index', array_merge($paramsBase, ['theme' => 'light', 'estilo' => 'claro'])) }}"
                   class="px-4 py-2 text-sm {{ ($themeLocal==='light' || $themeLocal==='claro') ? 'bg-gray-900 text-white' : 'bg-white text-gray-700' }}">
                    Claro
                </a>
                <a href="{{ route('accesorios.index', array_merge($paramsBase, ['theme' => 'dark', 'estilo' => 'oscuro'])) }}"
                   class="px-4 py-2 text-sm {{ ($themeLocal==='dark' || $themeLocal==='oscuro') ? 'bg-gray-900 text-white' : 'bg-white text-gray-700' }}">
                    Oscuro
                </a>
            </div>

            <a href="{{ route('accesorios.create') }}"
               class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition text-center">
                + Agregar accesorio
            </a>
        </div>
    </div>

    <div class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-300 rounded shadow-sm text-sm">
            <thead class="bg-gray-100 text-gray-700">
                <tr>
                    <th class="px-4 py-2 border">Imagen(es)</th>
                    <th class="px-4 py-2 border">Título</th>
                    <th class="px-4 py-2 border">Precio</th>
                    <th class="px-4 py-2 border">Stock</th>
                    <th class="px-4 py-2 border">Categoría</th>
                    <th class="px-4 py-2 border">Estilo</th>
                    <th class="px-4 py-2 border">Acciones</th>
                </tr>
            </thead>
            <tbody>
                @forelse($accesorios as $accesorio)
                    <tr class="border-t align-top">
                        <td class="px-4 py-2 border">
                            @if($accesorio->imagenes->count())
                                <div class="flex flex-wrap gap-2 max-w-[260px]">
                                    @foreach($accesorio->imagenes as $img)
                                        <img src="{{ Storage::disk(config('filesystems.default'))->url($img->ruta) }}"
                                             onerror="this.onerror=null;this.src='{{ asset('images/placeholder.png') }}';"
                                             class="w-16 h-16 object-cover rounded shadow"
                                             alt="{{ $accesorio->titulo }}">
                                    @endforeach
                                </div>
                            @else
                                <img src="{{ asset('images/placeholder.png') }}"
                                     class="w-16 h-16 object-cover rounded shadow inline-block"
                                     alt="Sin imagen">
                            @endif
                        </td>

                        <td class="px-4 py-2 border">{{ $accesorio->titulo }}</td>
                        <td class="px-4 py-2 border">${{ number_format($accesorio->precio, 2, ',', '.') }}</td>
                        <td class="px-4 py-2 border">{{ $accesorio->stock }}</td>
                        <td class="px-4 py-2 border">{{ $accesorio->categoria->nombre ?? '-' }}</td>
                        <td class="px-4 py-2 border uppercase text-xs">{{ $accesorio->estilo }}</td>

                        <td class="px-4 py-2 border text-center space-x-2">
                            <a href="{{ route('accesorios.edit', $accesorio->id) }}"
                               class="text-blue-600 hover:underline">Editar</a>
                            <form action="{{ route('accesorios.destroy', $accesorio->id) }}" method="POST" class="inline">
                                @csrf
                                @method('DELETE')
                                <button type="submit"
                                        onclick="return confirm('¿Estás seguro de eliminar este accesorio?')"
                                        class="text-red-600 hover:underline">
                                    Eliminar
                                </button>
                            </form>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="7" class="text-center px-4 py-6 text-gray-500 italic">
                            No hay accesorios que coincidan.
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>

        <div class="mt-6">
            {{ $accesorios->appends(request()->query())->links() }}
        </div>
    </div>
</div>
@endsection
