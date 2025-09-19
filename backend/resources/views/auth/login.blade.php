<x-guest-layout>
    <form method="POST" action="{{ route('login') }}">
        @csrf

        <!-- Email personalizado -->
        <div>
            <x-input-label for="Correo_Electronico" value="Correo electrónico" />
            <x-text-input id="Correo_Electronico"
                          class="block mt-1 w-full"
                          type="email"
                          name="Correo_Electronico"
                          :value="old('Correo_Electronico')"
                          required autofocus />
            <x-input-error :messages="$errors->get('Correo_Electronico')" class="mt-2" />
        </div>

        <!-- Contraseña -->
        <div class="mt-4">
            <x-input-label for="password" value="Contraseña" />
            <x-text-input id="password"
                          class="block mt-1 w-full"
                          type="password"
                          name="password"
                          required autocomplete="current-password" />
            <x-input-error :messages="$errors->get('password')" class="mt-2" />
        </div>

        <!-- Botones -->
        <div class="flex items-center justify-end mt-4">
            <a href="{{ route('register') }}" class="text-sm text-blue-600 hover:underline">
                ¿No tenés cuenta? Registrate
            </a>
            <x-primary-button class="ms-3">
                Iniciar sesión
            </x-primary-button>
        </div>
    </form>
</x-guest-layout>
