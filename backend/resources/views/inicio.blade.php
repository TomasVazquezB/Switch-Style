@extends('layouts.app')

@section('content')
<div class="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
    <h1 class="text-3xl font-bold text-gray-800 mb-4">
        Bienvenido/a, {{ Auth::user()->Nombre }}
    </h1>

    <p class="text-gray-600 mb-8 text-lg">
        Ingresaste como <strong class="capitalize">{{ Auth::user()->Tipo_Usuario }}</strong>.
    </p>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

        <!-- VER PRENDAS -->
        <a href="{{ route('ropas.index') }}" class="group p-6 bg-white border rounded-lg shadow hover:shadow-lg transition duration-200">
            <div class="flex items-center space-x-4">
                <div class="text-blue-600 text-4xl group-hover:text-blue-700">👕</div>
                <div>
                    <h2 class="text-lg font-semibold text-gray-800 group-hover:text-blue-700">Mis Prendas</h2>
                    <p class="text-sm text-gray-500">Ver prendas publicadas</p>
                </div>
            </div>
        </a>

        <!-- PUBLICAR PRENDA -->
        <a href="{{ route('ropas.create') }}" class="group p-6 bg-white border rounded-lg shadow hover:shadow-lg transition duration-200">
            <div class="flex items-center space-x-4">
                <div class="text-green-600 text-4xl group-hover:text-green-700">➕</div>
                <div>
                    <h2 class="text-lg font-semibold text-gray-800 group-hover:text-green-700">Publicar Prenda</h2>
                    <p class="text-sm text-gray-500">Subí una nueva prenda</p>
                </div>
            </div>
        </a>

        <!-- VER ACCESORIOS -->
        <a href="{{ route('accesorios.index') }}" class="group p-6 bg-white border rounded-lg shadow hover:shadow-lg transition duration-200">
            <div class="flex items-center space-x-4">
                <div class="text-pink-600 text-4xl group-hover:text-pink-700">💍</div>
                <div>
                    <h2 class="text-lg font-semibold text-gray-800 group-hover:text-pink-700">Mis Accesorios</h2>
                    <p class="text-sm text-gray-500">Ver accesorios publicados</p>
                </div>
            </div>
        </a>

        <!-- PUBLICAR ACCESORIO -->
        <a href="{{ route('accesorios.create') }}" class="group p-6 bg-white border rounded-lg shadow hover:shadow-lg transition duration-200">
            <div class="flex items-center space-x-4">
                <div class="text-yellow-600 text-4xl group-hover:text-yellow-700">➕</div>
                <div>
                    <h2 class="text-lg font-semibold text-gray-800 group-hover:text-yellow-700">Publicar Accesorio</h2>
                    <p class="text-sm text-gray-500">Subí un nuevo accesorio</p>
                </div>
            </div>
        </a>

        <!-- EDITAR PERFIL -->
        <a href="{{ route('profile.edit') }}" class="group p-6 bg-white border rounded-lg shadow hover:shadow-lg transition duration-200">
            <div class="flex items-center space-x-4">
                <div class="text-gray-600 text-4xl group-hover:text-gray-700">🛠️</div>
                <div>
                    <h2 class="text-lg font-semibold text-gray-800 group-hover:text-gray-700">Editar Perfil</h2>
                    <p class="text-sm text-gray-500">Modificar datos de usuario</p>
                </div>
            </div>
        </a>

        <!-- SOLO PARA ADMIN -->
        @if(strtolower(Auth::user()->Tipo_Usuario) === 'admin')
        <a href="{{ route('admin.usuarios.index') }}" class="group p-6 bg-white border rounded-lg shadow hover:shadow-lg transition duration-200">
            <div class="flex items-center space-x-4">
                <div class="text-purple-600 text-4xl group-hover:text-purple-700">👥</div>
                <div>
                    <h2 class="text-lg font-semibold text-gray-800 group-hover:text-purple-700">ABM Usuarios</h2>
                    <p class="text-sm text-gray-500">Gestionar usuarios del sistema</p>
                </div>
            </div>
        </a>
        @endif

    </div>
</div>
@endsection
