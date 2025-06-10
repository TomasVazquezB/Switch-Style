@extends('layouts.app')

@section('content')
<div class="max-w-7xl mx-auto mt-10 p-6 bg-white shadow rounded">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">👥 Gestión de Usuarios</h1>

    <!-- Buscador -->
    <form method="GET" action="{{ route('admin.usuarios.index') }}" class="mb-4">
        <input type="text" name="search" placeholder="Buscar por nombre o correo..."
               class="border border-gray-300 rounded px-3 py-2 w-full sm:w-1/3" value="{{ request('search') }}">
        <button class="bg-blue-600 text-white px-4 py-2 rounded ml-2 hover:bg-blue-700">
            🔍 Buscar
        </button>
    </form>

    <!-- Tabla de usuarios -->
    <div class="overflow-x-auto">
        <table class="min-w-full border border-gray-200 rounded shadow-sm">
            <thead class="bg-gray-100 text-gray-700 text-left">
                <tr>
                    <th class="px-4 py-2 border-b">#</th>
                    <th class="px-4 py-2 border-b">Nombre</th>
                    <th class="px-4 py-2 border-b">Correo Electrónico</th>
                    <th class="px-4 py-2 border-b">Rol</th>
                    <th class="px-4 py-2 border-b text-center">Acciones</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($usuarios as $usuario)
                    <tr class="hover:bg-gray-50">
                        <td class="px-4 py-2 border-b">{{ $usuario->ID_Usuario }}</td>
                        <td class="px-4 py-2 border-b">{{ $usuario->Nombre }}</td>
                        <td class="px-4 py-2 border-b">{{ $usuario->Correo_Electronico }}</td>
                        <td class="px-4 py-2 border-b">{{ $usuario->Tipo_Usuario }}</td>
                        <td class="px-4 py-2 border-b text-center space-x-2">
                            <a href="#" class="text-blue-600 hover:underline">Editar</a>
                            <form action="#" method="POST" class="inline">
                                @csrf @method('DELETE')
                                <button class="text-red-600 hover:underline" onclick="return confirm('¿Eliminar usuario?')">Eliminar</button>
                            </form>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="5" class="text-center text-gray-500 py-4">No se encontraron usuarios.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>
@endsection
