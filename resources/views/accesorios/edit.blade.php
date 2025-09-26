@extends('layouts.app')
@php use Illuminate\Support\Facades\Storage; @endphp

@section('content')
<div class="max-w-3xl mx-auto mt-12 bg-white shadow-md rounded-lg p-8">
    <h2 class="text-2xl font-bold mb-6 text-gray-800">Editar prenda</h2>

    @if ($errors->any())
        <div class="bg-red-100 text-red-700 p-4 rounded mb-6 border border-red-200">
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
            <label class="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input type="text" name="titulo" value="{{ old('titulo', $ropa->titulo) }}" required
                   class="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400">
        </div>

        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea name="descripcion" rows="3" required
                      class="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400">{{ old('descripcion', $ropa->descripcion) }}</textarea>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <select name="categoria_id" required class="w-full border border-gray-300 rounded-md px-4 py-2">
                    <option value="">Seleccione</option>
                    @foreach($categorias as $c)
                        <option value="{{ $c->id }}" {{ old('categoria_id', $ropa->categoria_id) == $c->id ? 'selected' : '' }}>
                            {{ $c->nombre }}
                        </option>
                    @endforeach
                </select>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Género</label>
                <select name="genero_id" required class="w-full border border-gray-300 rounded-md px-4 py-2">
                    <option value="">Seleccione</option>
                    @foreach($generos as $g)
                        <option value="{{ $g->id }}" {{ old('genero_id', $ropa->genero_id) == $g->id ? 'selected' : '' }}>
                            {{ $g->nombre }}
                        </option>
                    @endforeach
                </select>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                <input type="number" step="0.01" name="precio" value="{{ old('precio', $ropa->precio) }}" required
                       class="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400">
            </div>
        </div>

        {{-- Stock por talla (igual que tenías) --}}
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Stock por talla</label>
            <div class="flex flex-wrap gap-6">
                @foreach ($tallas as $talla)
                    @php
                        $pivot = $ropa->tallas->firstWhere('id', $talla->id)?->pivot;
                        $cantidad = old('tallas.' . $talla->id . '.cantidad', $pivot->cantidad ?? 0);
                    @endphp
                    <div class="flex flex-col items-center">
                        <label class="text-sm font-medium">{{ $talla->nombre }}</label>
                        <input type="hidden" name="tallas[{{ $talla->id }}][id]" value="{{ $talla->id }}">
                        <input type="number" min="0" name="tallas[{{ $talla->id }}][cantidad]"
                               value="{{ $cantidad }}"
                               class="w-20 text-center border border-gray-300 rounded-md px-2 py-1">
                    </div>
                @endforeach
            </div>
        </div>

        {{-- Imagen principal actual (mismo patrón que Accesorios) --}}
        <div>
            <p class="text-sm font-medium text-gray-700 mb-2">Imagen principal</p>
            @php
                $imgPrincipal = $ropa->imagenes->firstWhere('es_principal', true);
            @endphp
            @if($imgPrincipal)
                <img src="{{ Storage::url($imgPrincipal->ruta) }}"
                     onerror="this.onerror=null;this.src='{{ asset('images/placeholder.png') }}';"
                     class="h-24 w-24 object-cover rounded border">
            @else
                <span class="text-gray-500 text-sm">Sin imagen principal</span>
            @endif
        </div>

        {{-- Galería existente: elegir principal y borrar (radio + checkbox) --}}
        @if($ropa->imagenes->count())
            <div>
                <p class="text-sm font-medium text-gray-700 mb-2">Imágenes existentes</p>
                <div class="flex flex-wrap gap-4">
                    @foreach($ropa->imagenes as $img)
                        <label class="flex items-center gap-2 border rounded p-2">
                            <input type="radio" name="principal" value="{{ $img->id }}" {{ $img->es_principal ? 'checked' : '' }}>
                            <img src="{{ Storage::url($img->ruta) }}"
                                 onerror="this.onerror=null;this.src='{{ asset('images/placeholder.png') }}';"
                                 class="h-16 w-16 object-cover rounded">
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
            <input type="file" name="imagenes[]" multiple accept="image/*"
                   class="w-full border border-gray-300 rounded-md px-4 py-2">
            <p class="text-xs text-gray-500 mt-1">
                Si subís nuevas y no elegís principal, la <strong>primera subida</strong> se marcará como principal.
            </p>
        </div>

        <div class="flex justify-end gap-2">
            <a href="{{ route('ropas.index') }}"
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
