@extends('layouts.app')

@section('content')
<div class="max-w-5xl mx-auto mt-10 p-6 bg-white rounded shadow">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Gestión de Usuarios</h1>

    {{-- Flash genérico (éxito/errores) --}}
    @if (session('success'))
        <div class="mb-4 p-4 bg-green-100 text-green-800 rounded">
            {{ session('success') }}
        </div>
    @endif
    @if ($errors->any())
        <div class="mb-4 p-4 bg-red-100 text-red-800 rounded">
            <strong>Revisá los siguientes errores:</strong>
            <ul class="list-disc ml-6 mt-2">
                @foreach ($errors->all() as $e)
                    <li>{{ $e }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <div class="overflow-x-auto">
        <table class="w-full text-sm text-gray-700 border border-gray-200 text-center">
            <thead class="bg-gray-100 text-xs uppercase text-gray-600">
                <tr>
                    <th class="px-4 py-2">Nombre</th>
                    <th class="px-4 py-2">Correo Electrónico</th>
                    <th class="px-4 py-2">Tipo de Usuario</th>
                    <th class="px-4 py-2">Estado</th>
                    <th class="px-4 py-2">Acciones</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
                @forelse ($usuarios as $usuario)
                    @php
                        // Tolerancia a esquema mixto
                        $nombre = $usuario->Nombre ?? $usuario->name ?? '-';
                        $correo = $usuario->Correo_Electronico ?? $usuario->email ?? '-';
                        $tipo   = $usuario->Tipo_Usuario ?? '-';

                        // is_active puede ser null si el user es viejo
                        $activo = isset($usuario->is_active)
                                    ? (bool)$usuario->is_active
                                    : (isset($usuario->Activo) ? (bool)$usuario->Activo : true);
                    @endphp
                    <tr>
                        <td class="px-4 py-2">{{ $nombre }}</td>
                        <td class="px-4 py-2">{{ $correo }}</td>
                        <td class="px-4 py-2 capitalize">{{ $tipo }}</td>
                        <td class="px-4 py-2">
                            {{-- Toggle estado --}}
                            <form action="{{ route('admin.usuarios.toggle', $usuario) }}" method="POST">
                                @csrf
                                @method('PUT')
                                @if($activo)
                                    <button type="submit"
                                        class="inline-flex items-center px-3 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded hover:bg-green-200 transition">
                                        ✅ Activo (Click para desactivar)
                                    </button>
                                @else
                                    <button type="submit"
                                        class="inline-flex items-center px-3 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded hover:bg-red-200 transition">
                                        ❌ Inactivo (Click para activar)
                                    </button>
                                @endif
                            </form>
                        </td>
                        <td class="px-4 py-2 text-center">
                            <div class="flex justify-center items-center gap-2">
                                {{-- Editar --}}
                                <a href="{{ route('admin.usuarios.edit', $usuario) }}"
                                   class="inline-flex items-center bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition">
                                    ✏️ Editar
                                </a>

                                {{-- Eliminar --}}
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
                        <td colspan="5" class="px-4 py-4 text-gray-500">
                            No hay usuarios registrados.
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    {{-- Paginación si viene de ->paginate() --}}
    @if (method_exists($usuarios, 'links'))
        <div class="mt-6">
            {{ $usuarios->links() }}
        </div>
    @endif
</div>
@endsection
