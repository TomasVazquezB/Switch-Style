@extends('layouts.app')

@section('content')
<div class="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
    <h1 class="text-2xl font-bold mb-6 text-gray-800">✏️ Editar Usuario</h1>

    <form method="POST" action="{{ route('admin.usuarios.update', $user) }}">
        @csrf
        @method('PUT')

        {{-- Nombre --}}
        <div class="mb-4">
            <label class="block text-gray-700">Nombre</label>
            <input type="text" name="Nombre" value="{{ old('Nombre', $user->Nombre) }}"
                   class="w-full px-4 py-2 border rounded @error('Nombre') border-red-500 @enderror" required>
            @error('Nombre') <p class="text-red-500 text-sm">{{ $message }}</p> @enderror
        </div>

        {{-- Correo --}}
        <div class="mb-4">
            <label class="block text-gray-700">Correo Electrónico</label>
            <input type="email" name="Correo_Electronico" value="{{ old('Correo_Electronico', $user->Correo_Electronico) }}"
                   class="w-full px-4 py-2 border rounded @error('Correo_Electronico') border-red-500 @enderror" required>
            @error('Correo_Electronico') <p class="text-red-500 text-sm">{{ $message }}</p> @enderror
        </div>

        {{-- Tipo de Usuario --}}
        <div class="mb-4">
            <label class="block text-gray-700">Tipo de Usuario</label>
            <select name="Tipo_Usuario" class="w-full px-4 py-2 border rounded" required>
                <option value="admin"   {{ $user->Tipo_Usuario === 'admin' ? 'selected' : '' }}>Admin</option>
                <option value="free"    {{ $user->Tipo_Usuario === 'free' ? 'selected' : '' }}>Free</option>
                <option value="premium" {{ $user->Tipo_Usuario === 'premium' ? 'selected' : '' }}>Premium</option>
            </select>
        </div>

        {{-- Estado de la cuenta --}}
        <div class="mb-4">
            <label class="block text-gray-700">Estado de la cuenta</label>
            <select name="is_active" class="w-full px-4 py-2 border rounded">
                <option value="1" {{ $user->is_active ? 'selected' : '' }}>✅ Activo</option>
                <option value="0" {{ !$user->is_active ? 'selected' : '' }}>❌ Inactivo</option>
            </select>
            @error('is_active') <p class="text-red-500 text-sm">{{ $message }}</p> @enderror
        </div>

        <div class="flex justify-between">
            <a href="{{ route('admin.usuarios.index') }}"
               class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">Cancelar</a>

            <button type="submit"
                    class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Guardar Cambios
            </button>
        </div>
    </form>
</div>
@endsection
