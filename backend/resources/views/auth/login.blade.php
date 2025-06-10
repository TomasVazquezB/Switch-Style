@extends('layouts.app')

@section('content')
<div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md bg-white p-6 rounded shadow-md">
        <h2 class="text-2xl font-semibold text-center mb-4">Iniciar sesión</h2>

        @if(session('status'))
            <div class="bg-green-100 text-green-700 px-4 py-2 rounded mb-4">
                {{ session('status') }}
            </div>
        @endif

        <form method="POST" action="{{ route('login') }}">
            @csrf

            <div class="mb-4">
                <label for="email" class="block text-sm font-medium text-gray-700">Correo electrónico</label>
                <input type="email" id="email" name="email" value="{{ old('email') }}"
                       class="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-blue-300"
                       required autofocus autocomplete="username">
                @error('email')
                    <p class="text-sm text-red-600 mt-1">{{ $message }}</p>
                @enderror
            </div>

            <div class="mb-4">
                <label for="password" class="block text-sm font-medium text-gray-700">Contraseña</label>
                <input type="password" id="password" name="password"
                       class="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-blue-300"
                       required autocomplete="current-password">
                @error('password')
                    <p class="text-sm text-red-600 mt-1">{{ $message }}</p>
                @enderror
            </div>

            <div class="flex items-center justify-between mb-4">
                <label class="flex items-center text-sm text-gray-600">
                    <input type="checkbox" name="remember" class="mr-2"> Recuérdame
                </label>
                @if (Route::has('password.request'))
                    <a href="{{ route('password.request') }}" class="text-sm text-blue-600 hover:underline">
                        ¿Olvidaste tu contraseña?
                    </a>
                @endif
            </div>

            <button type="submit"
                    class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                Iniciar sesión
            </button>
        </form>
    </div>
</div>
@endsection
