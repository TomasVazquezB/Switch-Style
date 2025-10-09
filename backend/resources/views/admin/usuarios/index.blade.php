@extends('layouts.app')

@section('content')
<div class="max-w-5xl mx-auto mt-10 p-6 bg-white rounded shadow">
    <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800">👥 Gestión de Usuarios</h1>
        <a href="{{ route('admin.usuarios.create') }}"
           class="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
            ➕ Nuevo Usuario
        </a>
    </div>

    @if (session('success'))
        <div class="mb-4 p-4 bg-green-100 text-green-800 rounded">
            {{ session('success') }}
        </div>
    @endif

    <div class="overflow-x-auto">
        <table class="w-full text-sm text-gray-700 border border-gray-200 text-center">
            <thead class="bg-gray-100 text-xs uppercase text-gray-600">
                <tr>
                    <th class="px-4 py-2">Nombre</th>
                    <th class="px-4 py-2">Correo Electrónico</th>
                    <th class="px-4 py-2">Tipo de Usuario</th>
                    <th class="px-4 py-2">Acciones</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
                @forelse ($usuarios as $usuario)
                    <tr>
                        <td class="px-4 py-2">{{ $usuario->Nombre }}</td>
                        <td class="px-4 py-2">{{ $usuario->Correo_Electronico }}</td>
                        <td class="px-4 py-2">{{ $usuario->Tipo_Usuario }}</td>
                        <td class="px-4 py-2 text-center">
                            <div class="flex justify-center items-center gap-2">
                                <a href="{{ route('admin.usuarios.edit', $usuario) }}"
                                   class="inline-flex items-center bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition">
                                    ✏️ Editar
                                </a>

                                <form action="{{ route('admin.usuarios.destroy', $usuario) }}" method="POST"
                                      onsubmit="return confirm('¿Estás seguro de eliminar este usuario?');">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit"
                                            class="inline-flex items-center bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition">
                                        ❌ Eliminar
                                    </button>
                                </form>
                            </div>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="4" class="px-4 py-4 text-gray-500">
                            No hay usuarios registrados.
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>
@endsection
