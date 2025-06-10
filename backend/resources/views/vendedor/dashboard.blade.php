@extends('layouts.app')

@section('content')
<div class="max-w-4xl mx-auto mt-10 p-6 bg-white shadow rounded">
    <h1 class="text-2xl font-bold mb-6 text-gray-800">
        Bienvenido/a {{ Auth::user()->Nombre }} ({{ ucfirst(Auth::user()->Tipo_Usuario) }})
    </h1>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <a href="{{ route('ropas.create') }}" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            ➕ Agregar Prenda
        </a>

        <a href="{{ route('ropas.index') }}" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            📦 Ver Mis Prendas
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
