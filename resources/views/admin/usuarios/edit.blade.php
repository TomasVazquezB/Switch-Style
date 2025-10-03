@extends('layouts.app')

@section('content')
<div class="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
    <h1 class="text-2xl font-bold mb-6 text-gray-800">✏️ Editar Usuario</h1>

    <form method="POST" action="{{ route('admin.usuarios.update', $user) }}">
        @csrf
        @method('PUT')

        <div class="mb-4">
            <label class="block text-gray-700">Nombre</label>
            <input type="text" name="Nombre" value="{{ old('Nombre', $user->Nombre) }}"
                   class="w-full px-4 py-2 border rounded @error('Nombre') border-red-500 @enderror" required>
            @error('Nombre') <p class="text-red-500 text-sm">{{ $message }}</p> @enderror
        </div>

        <div class="mb-4">
            <label class="block text-gray-700">Correo Electrónico</label>
            <input type="email" name="Correo_Electronico" value="{{ old('Correo_Electronico', $user->Correo_Electronico) }}"
                   class="w-full px-4 py-2 border rounded @error('Correo_Electronico') border-red-500 @enderror" required>
            @error('Correo_Electronico') <p class="text-red-500 text-sm">{{ $message }}</p> @enderror
        </div>

        <div class="mb-4">
            <label class="block text-gray-700">Tipo de Usuario</label>
            <select name="Tipo_Usuario" class="w-full px-4 py-2 border rounded" required>
                <option value="Admin" {{ $user->Tipo_Usuario === 'Admin' ? 'selected' : '' }}>Admin</option>
                <option value="Free" {{ $user->Tipo_Usuario === 'Free' ? 'selected' : '' }}>Free</option>
                <option value="Premium" {{ $user->Tipo_Usuario === 'Premium' ? 'selected' : '' }}>Premium</option>
            </select>
        </div>

        <div class="mb-4">
            <label class="block text-gray-700">Nueva Contraseña (opcional)</label>
            <input type="password" name="Contraseña"
                   class="w-full px-4 py-2 border rounded @error('Contraseña') border-red-500 @enderror">
            @error('Contraseña') <p class="text-red-500 text-sm">{{ $message }}</p> @enderror
        </div>

        <div class="mb-6">
            <label class="block text-gray-700">Confirmar Nueva Contraseña</label>
            <input type="password" name="Contraseña_confirmation"
                   class="w-full px-4 py-2 border rounded">
        </div>

        <div class="flex justify-between">
            <a href="{{ route('admin.usuarios.index') }}"
               class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">Cancelar</a>

            <button type="submit"
                    class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                💾 Guardar Cambios
            </button>
        </div>
    </form>
</div>
@endsection
