@extends('layouts.app')
@php use Illuminate\Support\Facades\Storage; @endphp

@section('content')
<div class="max-w-3xl mx-auto mt-12 bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 border border-gray-200 dark:border-gray-700">
    <h2 class="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Editar prenda</h2>

    @if ($errors->any())
        <div class="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-4 rounded mb-6 border border-red-200 dark:border-red-800">
            <ul class="list-disc list-inside text-sm">
                @foreach ($errors->all() as $error)
                    <li class="leading-relaxed">{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <form action="{{ route('ropas.update', $ropa->id) }}" method="POST" enctype="multipart/form-data" class="space-y-6">
        @csrf
        @method('PUT')

        <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título</label>
            <input type="text" name="titulo" value="{{ old('titulo', $ropa->titulo) }}" required
                   class="w-full border border-gray-300 dark:border-gray-700 rounded-md px-4 py-2
                          bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                          focus:ring-2 focus:ring-blue-400 focus:outline-none">
        </div>

        <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción</label>
            <textarea name="descripcion" rows="3" required
                      class="w-full border border-gray-300 dark:border-gray-700 rounded-md px-4 py-2
                             bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                             focus:ring-2 focus:ring-blue-400 focus:outline-none">{{ old('descripcion', $ropa->descripcion) }}</textarea>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categoría</label>
                <select name="categoria_id" required
                        class="w-full border border-gray-300 dark:border-gray-700 rounded-md px-4 py-2
                               bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                    <option value="">Seleccione</option>
                    @foreach($categorias as $c)
                        <option value="{{ $c->id }}" {{ old('categoria_id', $ropa->categoria_id) == $c->id ? 'selected' : '' }}>
                            {{ $c->nombre }}
                        </option>
                    @endforeach
                </select>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Género</label>
                <select name="genero_id" required
                        class="w-full border border-gray-300 dark:border-gray-700 rounded-md px-4 py-2
                               bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                    <option value="">Seleccione</option>
                    @foreach($generos as $g)
                        <option value="{{ $g->id }}" {{ old('genero_id', $ropa->genero_id) == $g->id ? 'selected' : '' }}>
                            {{ $g->nombre }}
                        </option>
                    @endforeach
                </select>
            </div>
        </div>

        <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estilo</label>
            <select name="estilo" required
                    class="w-full border border-gray-300 dark:border-gray-700 rounded-md px-4 py-2
                           bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                <option value="claro" {{ old('estilo', $ropa->estilo)==='claro' ? 'selected' : '' }}>Claro</option>
                <option value="oscuro" {{ old('estilo', $ropa->estilo)==='oscuro' ? 'selected' : '' }}>Oscuro</option>
            </select>
            @error('estilo')<p class="text-xs text-red-600 dark:text-red-400 mt-1">{{ $message }}</p>@enderror
        </div>

        <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stock por talla</label>
            <div class="flex flex-wrap gap-6">
                @foreach ($tallas as $talla)
                    @php
                        $pivot = $ropa->tallas->firstWhere('id', $talla->id)?->pivot;
                        $cantidad = old('tallas.' . $talla->id . '.cantidad', $pivot->cantidad ?? 0);
                    @endphp
                    <div class="flex flex-col items-center">
                        <label class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ $talla->nombre }}</label>
                        <input type="hidden" name="tallas[{{ $talla->id }}][id]" value="{{ $talla->id }}">
                        <input type="number" min="0" name="tallas[{{ $talla->id }}][cantidad]"
                               value="{{ $cantidad }}"
                               class="w-20 text-center border border-gray-300 dark:border-gray-700 rounded-md px-2 py-1
                                      bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                    </div>
                @endforeach
            </div>
        </div>

        <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Precio</label>
            <input type="number" step="0.01" name="precio" value="{{ old('precio', $ropa->precio) }}" required
                   class="w-full border border-gray-300 dark:border-gray-700 rounded-md px-4 py-2
                          bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                          focus:ring-2 focus:ring-blue-400 focus:outline-none">
        </div>

        @if ($ropa->imagenes->count())
            <div>
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Imágenes existentes</p>
                <div class="flex flex-wrap gap-4">
                    @foreach($ropa->imagenes as $img)
                        <label class="flex items-center gap-2 border border-gray-200 dark:border-gray-700 rounded p-2
                                      bg-white dark:bg-gray-900">
                            <img src="{{ Storage::disk(config('filesystems.default'))->url($img->ruta) }}"
                                 onerror="this.onerror=null;this.src='{{ asset('images/placeholder.png') }}';"
                                 class="h-16 w-16 object-cover rounded border border-gray-200 dark:border-gray-700">
                            <span class="text-xs text-gray-600 dark:text-gray-400">#{{ $img->id }}</span>
                            <span class="ml-4 inline-flex items-center">
                                <input type="checkbox" name="borrar[]" value="{{ $img->id }}" class="mr-1">
                                <span class="text-xs text-red-600 dark:text-red-400">Eliminar</span>
                            </span>
                        </label>
                    @endforeach
                </div>
            </div>
        @endif

        <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Imágenes (podés subir nuevas)</label>
            <input type="file" name="imagenes[]" multiple accept="image/*"
                   class="w-full border border-gray-300 dark:border-gray-700 rounded-md px-4 py-2
                          bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Podés seleccionar varias imágenes a la vez.</p>
        </div>

        <div class="flex justify-end gap-2">
            <a href="{{ route('ropas.index') }}"
               class="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600">
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
