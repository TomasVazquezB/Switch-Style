@extends('layouts.app')

@section('content')
<div class="max-w-3xl mx-auto mt-12 bg-white shadow-md rounded-lg p-8">
    <h2 class="text-2xl font-bold mb-6 text-gray-800">Agregar accesorio</h2>

    @if ($errors->any())
        <div class="bg-red-100 text-red-700 p-4 rounded mb-6 border border-red-200">
            <ul class="list-disc list-inside text-sm">
                @foreach ($errors->all() as $error)
                    <li class="leading-relaxed">{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <form action="{{ route('accesorios.store') }}" method="POST" enctype="multipart/form-data" class="space-y-6">
        @csrf

        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input type="text" name="titulo" value="{{ old('titulo') }}" required
                   class="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400">
        </div>

        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea name="descripcion" rows="3" required
                      class="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400">{{ old('descripcion') }}</textarea>
        </div>

        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Precio</label>
            <input type="number" step="0.01" name="precio" value="{{ old('precio') }}" required
                   class="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400">
        </div>

        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select name="categoria_id" required class="w-full border border-gray-300 rounded-md px-4 py-2">
                <option value="">Seleccione una categoría</option>
                @foreach($categorias as $categoria)
                    <option value="{{ $categoria->id }}" {{ old('categoria_id') == $categoria->id ? 'selected' : '' }}>
                        {{ $categoria->nombre }}
                    </option>
                @endforeach
            </select>
        </div>

        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Imágenes (puede subir varias)</label>
            <input type="file" name="imagenes[]" multiple
                   class="w-full border border-gray-300 rounded-md px-4 py-2">
        </div>

        <div class="flex justify-end gap-2">
            <a href="{{ route('accesorios.index') }}"
               class="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
                Cancelar
            </a>
            <button type="submit"
                    class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Guardar
            </button>
        </div>
    </form>
</div>
@endsection
