@extends('layouts.app')

@section('content')
<div class="max-w-3xl mx-auto mt-12 bg-white shadow-md rounded-lg p-8">
    <h2 class="text-2xl font-bold mb-6 text-gray-800">Agregar prenda</h2>

    @if ($errors->any())
        <div class="bg-red-100 text-red-700 p-4 rounded mb-6 border border-red-200">
            <ul class="list-disc list-inside text-sm">
                @foreach ($errors->all() as $error)
                    <li class="leading-relaxed">{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <form action="{{ route('ropas.store') }}" method="POST" enctype="multipart/form-data" class="space-y-6">
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

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <select name="categoria_id" required class="w-full border border-gray-300 rounded-md px-4 py-2">
                    <option value="">Seleccione</option>
                    @foreach($categorias as $c)
                        <option value="{{ $c->id }}" {{ old('categoria_id') == $c->id ? 'selected' : '' }}>
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
                        <option value="{{ $g->id }}" {{ old('genero_id') == $g->id ? 'selected' : '' }}>
                            {{ $g->nombre }}
                        </option>
                    @endforeach
                </select>
            </div>
        </div>

        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Stock por talla</label>
            <div class="flex flex-wrap gap-6">
                @foreach ($tallas as $talla)
                    <div class="flex flex-col items-center">
                        <label class="text-sm font-medium">{{ $talla->nombre }}</label>
                        <input type="hidden" name="tallas[{{ $talla->id }}][id]" value="{{ $talla->id }}">
                        <input type="number" min="0" name="tallas[{{ $talla->id }}][cantidad]" value="0"
                               class="w-20 text-center border border-gray-300 rounded-md px-2 py-1">
                    </div>
                @endforeach
            </div>
        </div>

        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Precio</label>
            <input type="number" step="0.01" name="precio" value="{{ old('precio') }}" required
                   class="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400">
        </div>

        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Imágenes (podés subir varias)</label>
            <input id="imagenes" type="file" name="imagenes[]" multiple accept="image/*"
                   class="w-full border border-gray-300 rounded-md px-4 py-2">
            <p class="text-xs text-gray-500 mt-1">
                La primera imagen será la <strong>principal</strong>. Máx. 2 MB por imagen.
            </p>
            <div id="preview" class="mt-3 flex flex-wrap gap-3"></div>
        </div>

        <div class="text-end">
            <button type="submit"
                    class="bg-blue-600 text-white font-medium px-6 py-2 rounded-md hover:bg-blue-700 transition">
                Guardar
            </button>
        </div>
    </form>
</div>

{{-- Previsualización simple --}}
<script>
document.getElementById('imagenes')?.addEventListener('change', function (e) {
    const cont = document.getElementById('preview');
    cont.innerHTML = '';
    [...e.target.files].forEach((file, i) => {
        if (!file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = ev => {
            const wrap = document.createElement('div');
            wrap.className = 'relative';
            wrap.innerHTML = `
              <img src="${ev.target.result}" alt="preview ${i+1}"
                   class="h-20 w-20 object-cover rounded border shadow">
              ${i === 0 ? '<span class="absolute -top-2 -right-2 text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded">Principal</span>' : ''}
            `;
            cont.appendChild(wrap);
        };
        reader.readAsDataURL(file);
    });
});
</script>
@endsection
