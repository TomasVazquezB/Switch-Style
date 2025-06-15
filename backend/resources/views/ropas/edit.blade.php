@extends('layouts.app')

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

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <select name="categoria_id" required class="w-full border border-gray-300 rounded-md px-4 py-2">
                    <option value="">Seleccionar</option>
                    @foreach($categorias as $categoria)
                        <option value="{{ $categoria->id }}" {{ old('categoria_id', $ropa->categoria_id) == $categoria->id ? 'selected' : '' }}>
                            {{ $categoria->nombre }}
                        </option>
                    @endforeach
                </select>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Género</label>
                <select name="genero_id" required class="w-full border border-gray-300 rounded-md px-4 py-2">
                    <option value="">Seleccionar</option>
                    @foreach($generos as $genero)
                        <option value="{{ $genero->id }}" {{ old('genero_id', $ropa->genero_id) == $genero->id ? 'selected' : '' }}>
                            {{ $genero->nombre }}
                        </option>
                    @endforeach
                </select>
            </div>
        </div>

        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Precio</label>
            <input type="number" step="0.01" name="precio" value="{{ old('precio', $ropa->precio) }}" required
                   class="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400">
        </div>

        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Stock por talla</label>
            <div class="flex flex-wrap gap-6 items-center">
                @foreach($tallas as $talla)
                    @php
                        $cantidad = optional($ropa->tallas->firstWhere('id', $talla->id))->pivot->cantidad ?? 0;
                    @endphp
                    <div class="flex items-center gap-2">
                        <input type="hidden" name="tallas[{{ $talla->id }}][id]" value="{{ $talla->id }}">
                        <input type="number" min="0" name="tallas[{{ $talla->id }}][cantidad]" value="{{ old('tallas.'.$talla->id.'.cantidad', $cantidad) }}"
                               class="w-20 text-center border border-gray-300 rounded-md px-2 py-1">
                        <label class="text-sm font-medium">{{ $talla->nombre }}</label>
                    </div>
                @endforeach
            </div>
        </div>

        @if($ropa->imagenes->count())
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Imágenes actuales:</label>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
                    @foreach($ropa->imagenes as $img)
                        <div class="relative group border rounded overflow-hidden">
                            <img src="{{ asset('storage/' . $img->ruta) }}" class="w-full h-32 object-cover">

                            <form action="{{ route('imagenes.destroy', $img->id) }}" method="POST" class="absolute top-1 right-1">
                                @csrf
                                @method('DELETE')
                                <button type="submit" onclick="return confirm('¿Eliminar esta imagen?')"
                                        class="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700">
                                    ✕
                                </button>
                            </form>

                            <form action="{{ route('imagenes.principal', $img->id) }}" method="POST" class="absolute bottom-1 left-1">
                                @csrf
                                @method('PUT')
                                <button type="submit"
                                        class="bg-yellow-500 text-white text-xs px-2 py-1 rounded hover:bg-yellow-600">
                                    Principal
                                </button>
                            </form>
                        </div>
                    @endforeach
                </div>
            </div>
        @endif

        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Subir nuevas imágenes (opcional)</label>
            <input type="file" name="imagenes[]" multiple
                   class="w-full border border-gray-300 rounded-md px-4 py-2">
        </div>

        <div class="text-end">
            <button type="submit"
                    class="bg-blue-600 text-white font-medium px-6 py-2 rounded-md hover:bg-blue-700 transition">
                Actualizar
            </button>
        </div>
    </form>
</div>
@endsection
