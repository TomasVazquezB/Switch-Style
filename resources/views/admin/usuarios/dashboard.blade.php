@extends('layouts.app')

@section('content')
<div class="max-w-4xl mx-auto mt-10 p-6 bg-white shadow rounded">
    <h1 class="text-2xl font-bold mb-6 text-gray-800">
        Bienvenido, {{ Auth::user()->Nombre }}
    </h1>

    <p class="mb-6 text-gray-600">
        Estás conectado como 
        <strong class="capitalize">{{ Auth::user()->Tipo_Usuario }}</strong>.
        @if(!Auth::user()->is_active)
            <span class="text-red-600 ml-2 font-semibold">⚠️ Cuenta deshabilitada</span>
        @endif
    </p>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {{-- Publicar prenda --}}
        <a href="{{ route('ropas.create') }}"
           class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-center">
            ➕ Publicar Prenda
        </a>

        {{-- Ver prendas --}}
        <a href="{{ route('ropas.index') }}"
           class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-center">
            👕 Ver Mis Prendas
        </a>

        {{-- Editar perfil --}}
        <a href="{{ route('profile.edit') }}"
           class="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 text-center">
            🛠️ Editar Perfil
        </a>

        {{-- Logout --}}
        <form action="{{ route('logout') }}" method="POST" class="text-center">
            @csrf
            <button type="submit"
                    class="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                🔒 Cerrar sesión
            </button>
        </form>
    </div>
</div>
@endsection
