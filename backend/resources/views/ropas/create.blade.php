@extends('layouts.app')

@section('content')
  


<div class="max-w-2xl mx-auto mt-16 bg-white shadow-lg rounded-lg p-8">
    <h2 class="text-3xl font-bold mb-6 text-gray-800">
        {{ isset($ropa) ? 'Editar prenda' : 'Agregar prenda' }}
    </h2>

    @if ($errors->any())
        <div class="bg-red-100 text-red-700 p-4 rounded mb-6 border border-red-200">
            <ul class="list-disc list-inside text-sm">
                @foreach ($errors->all() as $error)
                    <li class="leading-relaxed">{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <form 
        action="{{ isset($ropa) ? route('ropas.update', $ropa->id) : route('ropas.store') }}"
        method="POST"
        enctype="multipart/form-data"
        class="space-y-5"
    >
        @csrf
        @if(isset($ropa)) @method('PUT') @endif

        <!-- TÍTULO -->
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input type="text" name="titulo" value="{{ old('titulo', $ropa->titulo ?? '') }}"
                   class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" required>
        </div>

        <!-- DESCRIPCIÓN -->
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea name="descripcion" rows="3"
                      class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      required>{{ old('descripcion', $ropa->descripcion ?? '') }}</textarea>
        </div>

        <!-- PRECIO Y CANTIDAD -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                <input type="number" name="precio" step="0.01"
                       value="{{ old('precio', $ropa->precio ?? '') }}"
                       class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                       required>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
                <input type="number" name="cantidad"
                       value="{{ old('cantidad', $ropa->cantidad ?? '') }}"
                       class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                       required>
            </div>
        </div>

        <!-- TALLA, CATEGORÍA, GÉNERO -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Talla</label>
                <select name="talla" class="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400" required>
                    @foreach(['S','M','L','XL','XXL'] as $t)
                        <option value="{{ $t }}" {{ old('talla', $ropa->talla ?? '') === $t ? 'selected' : '' }}>{{ $t }}</option>
                    @endforeach
                </select>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <select name="categoria" class="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400" required>
                    @foreach(['Remeras','Pantalones','Camperas','Shorts','Faldas','Vestidos'] as $c)
                        <option value="{{ $c }}" {{ old('categoria', $ropa->categoria ?? '') === $c ? 'selected' : '' }}>{{ $c }}</option>
                    @endforeach
                </select>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Género</label>
                <select name="genero" class="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400" required>
                    @foreach(['Hombre','Mujer'] as $g)
                        <option value="{{ $g }}" {{ old('genero', $ropa->genero ?? '') === $g ? 'selected' : '' }}>{{ $g }}</option>
                    @endforeach
                </select>
            </div>
        </div>

        <!-- IMAGEN ACTUAL -->
        @if(isset($ropa) && $ropa->ruta_imagen)
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Imagen actual:</label>
                <img src="{{ asset('storage/' . $ropa->ruta_imagen) }}" alt="Imagen actual" class="w-32 rounded shadow border mt-2">
            </div>
        @endif

        <!-- NUEVA IMAGEN -->
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Imagen (opcional)</label>
            <input type="file" name="imagen" class="w-full border border-gray-300 rounded-md px-4 py-2">
        </div>

        <!-- BOTÓN -->
        <div class="text-end">
            <button type="submit"
                    class="bg-blue-600 text-white font-medium px-6 py-2 rounded-md hover:bg-blue-700 transition">
                {{ isset($ropa) ? 'Actualizar' : 'Guardar' }}
            </button>
        </div>
    </form>
</div>


@endsection