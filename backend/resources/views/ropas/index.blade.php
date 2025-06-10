@extends('layouts.app')

@section('content')
<div class="max-w-6xl mx-auto mt-12 p-6 bg-white rounded shadow">
    <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Listado de ropa</h2>
        <a href="{{ route('ropas.create') }}"
           class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">+ Nueva prenda</a>
    </div>

    @if(session('success'))
        <div class="bg-green-100 text-green-800 px-4 py-2 rounded mb-4">
            {{ session('success') }}
        </div>
    @endif

    @if($ropas->count())
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            @foreach($ropas as $ropa)
            <div class="border rounded shadow p-4 bg-gray-50">
                <img src="{{ asset('storage/' . $ropa->ruta_imagen) }}" class="w-full h-48 object-cover rounded mb-4" alt="Imagen">

                <h3 class="text-lg font-bold text-gray-800">{{ $ropa->titulo }}</h3>
                <p class="text-sm text-gray-600 mb-2">{{ $ropa->descripcion }}</p>

                <ul class="text-sm text-gray-700 mb-4">
                    <li><strong>Precio:</strong> ${{ $ropa->precio }}</li>
                    <li><strong>Cantidad:</strong> {{ $ropa->cantidad }}</li>
                    <li><strong>Talla:</strong> {{ $ropa->talla }}</li>
                    <li><strong>Categoría:</strong> {{ $ropa->categoria }}</li>
                    <li><strong>Género:</strong> {{ $ropa->genero }}</li>
                </ul>

                <div class="flex justify-between items-center">
                    <a href="{{ route('ropas.edit', $ropa->id) }}"
                       class="text-blue-600 hover:underline">Editar</a>

                    <form action="{{ route('ropas.destroy', $ropa->id) }}" method="POST"
                          onsubmit="return confirm('¿Eliminar esta prenda?')">
                        @csrf
                        @method('DELETE')
                        <button type="submit" class="text-red-600 hover:underline">Eliminar</button>
                    </form>
                </div>
            </div>
            @endforeach
        </div>
    @else
        <p class="text-gray-500">No hay prendas aún.</p>
    @endif
</div>
@endsection
