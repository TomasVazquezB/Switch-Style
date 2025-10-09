<nav class="bg-white border-b border-gray-200 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
            <!-- Logo -->
            <div class="flex items-center space-x-8">
                <a href="/">
                    <x-application-logo class="h-8 w-auto text-gray-800" />
                </a>
                <x-nav-link :href="route('profile.edit')" :active="request()->routeIs('profile.edit')">
                    {{ __('Perfil') }}
                </x-nav-link>

                <!-- Solo admins -->
                @if (Auth::check() && strtolower(Auth::user()->Tipo_Usuario) === 'admin')
                    <x-nav-link :href="route('admin.usuarios.index')" :active="request()->routeIs('admin.usuarios.*')">
                        {{ __('Panel de Usuarios') }}
                    </x-nav-link>
                @endif

                <x-nav-link :href="route('ropas.index')" :active="request()->routeIs('ropas.*')">
                    {{ __('Mis Prendas') }}
                </x-nav-link>

                {{-- ✅ Nuevos accesos para accesorios --}}
                <x-nav-link :href="route('accesorios.index')" :active="request()->routeIs('accesorios.*')">
                    {{ __('Mis Accesorios') }}
                </x-nav-link>
            </div>

            <!-- Usuario + Logout -->
            <div class="flex items-center space-x-4">
                <span class="text-gray-600 text-sm hidden sm:block">
                    {{ Auth::user()->Nombre }}
                </span>

                <form method="POST" action="{{ route('logout') }}">
                    @csrf
                    <button class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm">
                        Cerrar sesión
                    </button>
                </form>
            </div>
        </div>
    </div>
</nav>
