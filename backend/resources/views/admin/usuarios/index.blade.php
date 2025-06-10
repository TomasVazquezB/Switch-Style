@extends('layouts.app')

@section('content')
<main class="mt-10 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto bg-white p-6 shadow rounded">
        <!-- Título -->
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold text-gray-800">Gestión de Usuarios</h1>
        </div>

        <!-- Mensaje de éxito -->
        @if (session('success'))
            <div class="mb-4 p-4 bg-green-100 text-green-800 rounded">
                {{ session('success') }}
            </div>
        @endif

        <!-- Tabla centrada -->
        <div class="overflow-x-auto">
            <table class="w-full table-fixed text-sm text-gray-700 border border-gray-200 text-center">
                <thead class="bg-gray-100 text-xs uppercase text-gray-600">
                    <tr>
                        <th class="px-4 py-3 w-1/5 truncate">Nombre</th>
                        <th class="px-4 py-3 w-2/5 truncate">Correo Electrónico</th>
                        <th class="px-4 py-3 w-1/5 truncate">Tipo de Usuario</th>
                        <th class="px-4 py-3 w-1/5 truncate">Acciones</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                    @forelse ($usuarios as $usuario)
                        <tr>
                            <td class="px-4 py-3 truncate">{{ $usuario->Nombre }}</td>
                            <td class="px-4 py-3 truncate">{{ $usuario->Correo_Electronico }}</td>
                            <td class="px-4 py-3 capitalize truncate">{{ $usuario->Tipo_Usuario }}</td>
                            <td class="px-4 py-3 space-x-1">
                                <a href="{{ route('admin.usuarios.edit', $usuario) }}"
                                   class="inline-flex items-center bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none"
                                         viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                              d="M15.232 5.232l3.536 3.536M9 13l6.536-6.536a2 2 0 112.828 2.828L11.828 16H9v-2.828z"/>
                                    </svg>
                                    Editar
                                </a>

                                <form action="{{ route('admin.usuarios.destroy', $usuario) }}" method="POST"
                                      class="inline-block"
                                      onsubmit="return confirm('¿Estás seguro de eliminar este usuario?');">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit"
                                            class="inline-flex items-center bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none"
                                             viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                  d="M6 18L18 6M6 6l12 12"/>
                                        </svg>
                                        Eliminar
                                    </button>
                                </form>
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

    <!-- FAB Crear Usuario -->
    <a href="{{ route('admin.usuarios.create') }}"
       class="group fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg z-50 transition transform hover:scale-110"
       title="Crear Usuario">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
             viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="M12 4v16m8-8H4"/>
        </svg>
        <span class="sr-only">Crear Usuario</span>
    </a>
</main>
@endsection
