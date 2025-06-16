@extends('layouts.app')

@section('content')
<div class="max-w-3xl mx-auto mt-12 bg-white p-8 rounded shadow">
    <h2 class="text-2xl font-bold mb-6 text-gray-800">Editar accesorio</h2>

    @if ($errors->any())
        <div class="mb-4 p-4 bg-red-100 text-red-700 rounded">
            <ul class="list-disc list-inside text-sm">
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <form action="{{ route('accesorios.update', $accesorio->id) }}" method="POST" enctype="multipart/form-data" class="space-y-6">
        @csrf
        @method('PUT')

        <div>
            <label class="block text-sm font-medium mb-1">Título</label>
            <input type="text" name="titulo" value="{{ old('titulo', $accesorio->titulo) }}" required
                   class="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-blue-500">
        </div>

        <div>
            <label class="block text-sm font-medium mb-1">Descripción</label>
            <textarea name="descripcion" rows="3" required
                      class="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-blue-500">{{ old('descripcion', $accesorio->descripcion) }}</textarea>
        </div>

        <div>
            <label class="block text-sm font-medium mb-1">Precio</label>
            <input type="number" step="0.01" name="precio" value="{{ old('precio', $accesorio->precio) }}" required
                   class="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-blue-500">
        </div>

        <div>
            <label class="block text-sm font-medium mb-1">Categoría</label>
            <select name="categoria_id" required class="w-full border rounded px-4 py-2">
                <option value="">Seleccione una categoría</option>
                @foreach($categorias as $categoria)
                    <option value="{{ $categoria->id }}" {{ old('categoria_id', $accesorio->categoria_id) == $categoria->id ? 'selected' : '' }}>
                        {{ $categoria->nombre }}
                    </option>
                @endforeach
            </select>
        </div>

        <!-- Imágenes actuales -->
        @if($accesorio->imagenes->count())
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Imágenes actuales:</label>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
                    @foreach($accesorio->imagenes as $img)
                        <div class="relative group border rounded overflow-hidden">
                            <img src="{{ asset('storage/' . $img->ruta) }}" class="w-full h-32 object-cover rounded">

                            <!-- Botón eliminar -->
                            <form action="{{ route('imagenes.destroy', $img->id) }}" method="POST" class="absolute top-1 right-1 z-10">
                                @csrf
                                @method('DELETE')
                                <button type="submit" onclick="return confirm('¿Eliminar esta imagen?')"
                                        class="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700">
                                    ✕
                                </button>
                            </form>

                            <!-- Botón principal -->
                            <form action="{{ route('imagenes.principal', $img->id) }}" method="POST" class="absolute bottom-1 left-1 z-10">
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

        <!-- Subir nuevas imágenes -->
        <div>
            <label class="block text-sm font-medium mb-1">Subir nuevas imágenes (opcional)</label>
            <input type="file" name="imagenes[]" multiple class="w-full border rounded px-4 py-2">
        </div>

        <div class="flex justify-end gap-4 mt-6">
            <a href="{{ route('accesorios.index') }}"
               class="px-5 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">Cancelar</a>

            <button type="submit"
                    class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Actualizar
            </button>
        </div>
    </form>
</div>
@endsection
