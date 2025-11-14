@extends('layouts.app')
@php use Illuminate\Support\Facades\Storage; @endphp

@section('content')
<div class="max-w-4xl mx-auto mt-12 bg-white shadow-md rounded-lg p-8">
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

        {{-- TÍTULO --}}
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input type="text" name="titulo" value="{{ old('titulo', $accesorio->titulo) }}" required
                   class="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400">
        </div>

        {{-- DESCRIPCIÓN --}}
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea name="descripcion" rows="3" required
                      class="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400">{{ old('descripcion', $accesorio->descripcion) }}</textarea>
        </div>

        {{-- PRECIO / STOCK / CATEGORÍA --}}
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                <input type="number" step="0.01" name="precio" value="{{ old('precio', $accesorio->precio) }}" required
                       class="w-full border border-gray-300 rounded-md px-4 py-2">
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                <input type="number" name="stock" value="{{ old('stock', $accesorio->stock) }}" min="0" required
                       class="w-full border border-gray-300 rounded-md px-4 py-2">
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <select name="categoria_id" required class="w-full border border-gray-300 rounded-md px-4 py-2">
                    <option value="">Seleccione</option>
                    @foreach($categorias as $c)
                        <option value="{{ $c->id }}" {{ old('categoria_id', $accesorio->categoria_id) == $c->id ? 'selected' : '' }}>
                            {{ $c->nombre }}
                        </option>
                    @endforeach
                </select>
            </div>
        </div>

        {{-- ESTILO --}}
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Estilo</label>
            <select name="estilo" required class="w-full border border-gray-300 rounded-md px-4 py-2">
                <option value="claro" {{ old('estilo', $accesorio->estilo)==='claro' ? 'selected' : '' }}>Claro</option>
                <option value="oscuro" {{ old('estilo', $accesorio->estilo)==='oscuro' ? 'selected' : '' }}>Oscuro</option>
            </select>
        </div>

        {{-- IMÁGENES EXISTENTES --}}
        @if ($accesorio->imagenes->count())
            <div>
                <p class="text-sm font-medium text-gray-700 mb-2">Imágenes actuales</p>

                <div class="flex flex-wrap gap-4">
                    @foreach($accesorio->imagenes as $img)
                        <label class="flex items-center gap-3 border rounded p-2 bg-gray-50">
                            <img src="{{ Storage::disk(config('filesystems.default'))->url($img->ruta) }}"
                                 onerror="this.onerror=null;this.src='{{ asset('images/placeholder.png') }}';"
                                 class="h-16 w-16 object-cover rounded">

                            <div>
                                <div class="flex items-center gap-2">
                                    <input type="radio" name="principal" value="{{ $img->id }}"
                                           {{ old('principal', $accesorio->imagenes->firstWhere('es_principal', true)->id ?? null) == $img->id ? 'checked' : '' }}>
                                    <span class="text-xs">Principal</span>
                                </div>

                                <div class="flex items-center gap-2 mt-1">
                                    <input type="checkbox" name="borrar[]" value="{{ $img->id }}">
                                    <span class="text-xs text-red-600">Eliminar</span>
                                </div>
                            </div>
                        </label>
                    @endforeach
                </div>
            </div>
        @endif

        {{-- SUBIR NUEVAS IMÁGENES --}}
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Agregar nuevas imágenes</label>
            <input id="imagenes" type="file" name="imagenes[]" multiple accept="image/*"
                   class="w-full border border-gray-300 rounded px-4 py-2">
            <p class="text-xs text-gray-500 mt-1">
                Podés subir varias. La primera nueva será principal si no elegís otra.
            </p>

            <div id="preview" class="mt-4 flex flex-wrap gap-3"></div>
        </div>

        {{-- BOTONES --}}
        <div class="flex justify-end gap-2">
            <a href="{{ route('accesorios.index') }}"
               class="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition">
                Cancelar
            </a>

            <button type="submit"
                    class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                Actualizar
            </button>
        </div>
    </form>
</div>

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
              <img src="${ev.target.result}" alt="preview"
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
