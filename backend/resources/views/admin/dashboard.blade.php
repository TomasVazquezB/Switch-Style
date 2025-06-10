@extends('layouts.app')

@section('content')
<div class="max-w-4xl mx-auto mt-10 p-6 bg-white shadow rounded">
    <h1 class="text-2xl font-bold mb-6 text-gray-800">Panel del Administrador General</h1>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <a href="{{ route('ropas.create') }}" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            ➕ Agregar Prenda
        </a>

        <a href="{{ route('ropas.index') }}" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            📦 Ver Todas las Prendas
        </a>

        <a href="#" class="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
            👥 Gestionar Usuarios
        </a>

        <form action="{{ route('auth.logout') }}" method="POST">
            @csrf
            <button class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                🔒 Cerrar sesión
            </button>
        </form>
    </div>
</div>
@endsection
