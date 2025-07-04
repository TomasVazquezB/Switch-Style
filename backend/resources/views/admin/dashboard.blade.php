@extends('layouts.app')

@section('content')
<main class="mt-10 px-6">
    <div class="max-w-4xl mx-auto p-6 bg-white shadow rounded">
        <h1 class="text-2xl font-bold mb-6 text-gray-800">
            Bienvenido, {{ Auth::user()->Nombre }}
        </h1>

        <p class="mb-6 text-gray-600">
            Estás conectado como <strong>{{ Auth::user()->Tipo_Usuario }}</strong>.
            Desde aquí puedes gestionar tus prendas, perfil, y administración de usuarios si sos admin.
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a href="{{ route('ropas.create') }}"
               class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                ➕ Publicar Prenda
            </a>

            <a href="{{ route('ropas.index') }}"
               class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                👕 Ver Mis Prendas
            </a>

            <a href="{{ route('profile.edit') }}"
               class="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
                🛠️ Editar Perfil
            </a>

            <form action="{{ route('logout') }}" method="POST">
                @csrf
                <button type="submit"
                        class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                    🔒 Cerrar sesión
                </button>
            </form>

            @if (strtolower(Auth::user()->Tipo_Usuario) === 'admin')
                <a href="{{ route('admin.usuarios.index') }}"
                   class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 col-span-1 sm:col-span-2 text-center">
                    👥 Administrar Usuarios
                </a>
            @endif
        </div>
    </div>
</main>
@endsection
