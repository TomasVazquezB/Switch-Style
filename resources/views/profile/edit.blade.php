@extends('layouts.app')

@section('content')
<div class="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">👤 Mi Perfil</h1>

    {{-- Mensaje de éxito --}}
    @if (session('success'))
        <div class="mb-6 p-4 bg-green-100 text-green-800 rounded">
            {{ session('success') }}
        </div>
    @endif

    {{-- Formulario de edición de datos --}}
    <form method="POST" action="{{ route('profile.update') }}">
        @csrf
        @method('PUT')

        <div class="mb-4">
            <label class="block text-gray-700">Nombre</label>
            <input type="text" name="Nombre" 
                   value="{{ old('Nombre', Auth::user()->Nombre) }}"
                   class="w-full px-4 py-2 border rounded @error('Nombre') border-red-500 @enderror" required>
            @error('Nombre') <p class="text-red-500 text-sm">{{ $message }}</p> @enderror
        </div>

        <div class="mb-4">
            <label class="block text-gray-700">Correo Electrónico</label>
            <input type="email" name="Correo_Electronico" 
                   value="{{ old('Correo_Electronico', Auth::user()->Correo_Electronico) }}"
                   class="w-full px-4 py-2 border rounded @error('Correo_Electronico') border-red-500 @enderror" required>
            @error('Correo_Electronico') <p class="text-red-500 text-sm">{{ $message }}</p> @enderror
        </div>

        <div class="mb-6">
            <label class="block text-gray-700">Tipo de Usuario</label>
            <input type="text" value="{{ Auth::user()->Tipo_Usuario }}" readonly
                   class="w-full px-4 py-2 border rounded bg-gray-100 cursor-not-allowed">
        </div>

        <div class="flex justify-end">
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                💾 Guardar Cambios
            </button>
        </div>
    </form>

    <hr class="my-8">

    {{-- Formulario de cambio de contraseña --}}
    <h2 class="text-xl font-semibold text-gray-800 mb-4">🔒 Cambiar Contraseña</h2>

    <form method="POST" action="{{ route('profile.password.update') }}">
        @csrf
        @method('PUT')

        <div class="mb-4">
            <label class="block text-gray-700">Contraseña Actual</label>
            <input type="password" name="current_password"
                   class="w-full px-4 py-2 border rounded @error('current_password') border-red-500 @enderror" required>
            @error('current_password') <p class="text-red-500 text-sm">{{ $message }}</p> @enderror
        </div>

        <div class="mb-4">
            <label class="block text-gray-700">Nueva Contraseña</label>
            <input type="password" name="password"
                   class="w-full px-4 py-2 border rounded @error('password') border-red-500 @enderror" required>
            @error('password') <p class="text-red-500 text-sm">{{ $message }}</p> @enderror
        </div>

        <div class="mb-6">
            <label class="block text-gray-700">Confirmar Nueva Contraseña</label>
            <input type="password" name="password_confirmation"
                   class="w-full px-4 py-2 border rounded" required>
        </div>

        <div class="flex justify-end">
            <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                🔁 Actualizar Contraseña
            </button>
        </div>
    </form>
</div>
@endsection
