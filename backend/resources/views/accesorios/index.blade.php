@extends('layouts.app')

@section('content')
<div class="max-w-7xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-6 text-gray-800">Mis Accesorios</h2>

    @if(session('success'))
        <div class="mb-4 p-3 bg-green-100 text-green-700 rounded">
            {{ session('success') }}
        </div>
    @endif

    <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <!-- Filtros -->
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
                    @foreach($categorias as $categoria)
                        <option value="{{ $categoria->id }}" {{ request('categoria_id') == $categoria->id ? 'selected' : '' }}>
                            {{ $categoria->nombre }}
                        </option>
                    @endforeach
                </select>
            </div>

            <button type="submit"
                    class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                Filtrar
            </button>
        </form>

        <a href="{{ route('accesorios.create') }}"
           class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition text-center">
            + Agregar accesorio
        </a>
    </div>

    <div class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-300 rounded shadow-sm text-sm">
            <thead class="bg-gray-100 text-gray-700">
                <tr>
                    <th class="px-4 py-2 border">Imagen</th>
                    <th class="px-4 py-2 border">Título</th>
                    <th class="px-4 py-2 border">Precio</th>
                    <th class="px-4 py-2 border">Categoría</th>
                    <th class="px-4 py-2 border">Acciones</th>
                </tr>
            </thead>
            <tbody>
                @forelse($accesorios as $accesorio)
                    <tr class="border-t">
                        <td class="px-4 py-2 border text-center">
                            @if($accesorio->ruta_imagen)
                                <img src="{{ asset('storage/' . $accesorio->ruta_imagen) }}" class="w-16 h-16 object-cover rounded shadow inline-block">
                            @else
                                <span class="text-gray-400 italic">Sin imagen</span>
                            @endif
                        </td>
                        <td class="px-4 py-2 border">{{ $accesorio->titulo }}</td>
                        <td class="px-4 py-2 border">${{ number_format($accesorio->precio, 2, ',', '.') }}</td>
                        <td class="px-4 py-2 border">{{ $accesorio->categoria->nombre ?? '-' }}</td>
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
                        <td colspan="5" class="text-center px-4 py-6 text-gray-500 italic">
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
