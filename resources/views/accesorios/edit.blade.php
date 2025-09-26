@extends('layouts.app')
@php use Illuminate\Support\Facades\Storage; @endphp

@section('content')
<div class="max-w-3xl mx-auto mt-12 bg-white shadow-md rounded-lg p-8">
    <h2 class="text-2xl font-bold mb-6 text-gray-800">Editar accesorio</h2>

    @if ($errors->any())
        <div class="bg-red-100 text-red-700 p-4 rounded mb-6 border border-red-200">
            <ul class="list-disc list-inside text-sm">
                @foreach ($errors->all() as $error)
                    <li class="leading-relaxed">{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <form action="{{ route('accesorios.update', $accesorio->id) }}" method="POST" enctype="multipart/form-data" class="space-y-6">
        @csrf
        @method('PUT')

        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input type="text" name="titulo" value="{{ old('titulo', $accesorio->titulo) }}" required
                   class="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400">
        </div>

        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea name="descripcion" rows="3" required
                      class="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400">{{ old('descripcion', $accesorio->descripcion) }}</textarea>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                <input type="number" step="0.01" name="precio" value="{{ old('precio', $accesorio->precio) }}" required
                       class="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400">
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                <input type="number" name="stock" value="{{ old('stock', $accesorio->stock) }}" min="0" required
                       class="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400">
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <select name="categoria_id" required class="w-full border border-gray-300 rounded-md px-4 py-2">
                    <option value="">Seleccione una categoría</option>
                    @foreach($categorias as $categoria)
                        <option value="{{ $categoria->id }}" {{ (old('categoria_id', $accesorio->categoria_id) == $categoria->id) ? 'selected' : '' }}>
                            {{ $categoria->nombre }}
                        </option>
                    @endforeach
                </select>
            </div>
        </div>

        {{-- Imagen principal actual --}}
        <div>
            <p class="text-sm font-medium text-gray-700 mb-2">Imagen principal</p>
            @if($accesorio->ruta_imagen)
                <img src="{{ Storage::url($accesorio->ruta_imagen) }}" class="h-24 w-24 object-cover rounded border">
            @else
                <span class="text-gray-500 text-sm">Sin imagen principal</span>
            @endif
        </div>

        {{-- Galería existente: elegir principal y borrar --}}
        @if($accesorio->imagenes->count())
            <div>
                <p class="text-sm font-medium text-gray-700 mb-2">Imágenes existentes</p>
                <div class="flex flex-wrap gap-4">
                    @foreach($accesorio->imagenes as $img)
                        <label class="flex items-center gap-2 border rounded p-2">
                            <input type="radio" name="principal" value="{{ $img->id }}" {{ $img->es_principal ? 'checked' : '' }}>
                            <img src="{{ Storage::url($img->ruta) }}" class="h-16 w-16 object-cover rounded">
                            <span class="text-xs text-gray-600">#{{ $img->id }}</span>
                            <span class="ml-2 text-xs text-gray-500">Principal</span>
                            <span class="ml-4">
                                <input type="checkbox" name="borrar[]" value="{{ $img->id }}" class="mr-1">
                                <span class="text-xs text-red-600">Eliminar</span>
                            </span>
                        </label>
                    @endforeach
                </div>
            </div>
        @endif

        {{-- Subir nuevas --}}
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Imágenes (podés subir nuevas)</label>
            <input type="file" name="imagenes[]" multiple class="w-full border border-gray-300 rounded-md px-4 py-2">
            <p class="text-xs text-gray-500 mt-1">
                Si subís nuevas y no elegís principal, la primera subida se marcará como principal.
            </p>
        </div>

        <div class="flex justify-end gap-2">
            <a href="{{ route('accesorios.index') }}"
               class="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
                Cancelar
            </a>
            <button type="submit"
                    class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Actualizar
            </button>
        </div>
    </form>
</div>
@endsection
