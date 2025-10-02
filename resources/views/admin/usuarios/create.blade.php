@extends('layouts.app')

@section('content')
<div class="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
    <h1 class="text-2xl font-bold mb-6 text-gray-800">➕ Crear Usuario</h1>

    <form method="POST" action="{{ route('admin.usuarios.store') }}">
        @csrf

        {{-- Nombre --}}
        <div class="mb-4">
            <label class="block text-gray-700">Nombre</label>
            <input type="text" name="Nombre" value="{{ old('Nombre') }}"
                   class="w-full px-4 py-2 border rounded @error('Nombre') border-red-500 @enderror" required>
            @error('Nombre') <p class="text-red-500 text-sm">{{ $message }}</p> @enderror
        </div>

        {{-- Correo --}}
        <div class="mb-4">
            <label class="block text-gray-700">Correo Electrónico</label>
            <input type="email" name="Correo_Electronico" value="{{ old('Correo_Electronico') }}"
                   class="w-full px-4 py-2 border rounded @error('Correo_Electronico') border-red-500 @enderror" required>
            @error('Correo_Electronico') <p class="text-red-500 text-sm">{{ $message }}</p> @enderror
        </div>

        {{-- Contraseña --}}
        <div class="mb-4">
            <label class="block text-gray-700">Contraseña</label>
            <input type="password" name="Contraseña"
                   class="w-full px-4 py-2 border rounded @error('Contraseña') border-red-500 @enderror" required>
            @error('Contraseña') <p class="text-red-500 text-sm">{{ $message }}</p> @enderror
        </div>

        {{-- Confirmar Contraseña --}}
        <div class="mb-4">
            <label class="block text-gray-700">Confirmar Contraseña</label>
            <input type="password" name="Contraseña_confirmation"
                   class="w-full px-4 py-2 border rounded" required>
        </div>

        {{-- Tipo de Usuario --}}
        <div class="mb-4">
            <label class="block text-gray-700">Tipo de Usuario</label>
            <select name="Tipo_Usuario" class="w-full px-4 py-2 border rounded" required>
                <option value="">Seleccione...</option>
                <option value="admin"   {{ old('Tipo_Usuario')==='admin'?'selected':'' }}>Admin</option>
                <option value="free"    {{ old('Tipo_Usuario')==='free'?'selected':'' }}>Free</option>
                <option value="premium" {{ old('Tipo_Usuario')==='premium'?'selected':'' }}>Premium</option>
            </select>
            @error('Tipo_Usuario') <p class="text-red-500 text-sm">{{ $message }}</p> @enderror
        </div>

        <div class="flex justify-between">
            <a href="{{ route('admin.usuarios.index') }}"
               class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">Cancelar</a>

            <button type="submit"
                    class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                Crear Usuario
            </button>
        </div>
    </form>
</div>
@endsection
