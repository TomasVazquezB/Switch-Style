<h2>Editar prenda</h2>

@if ($errors->any())
    <div style="color: red;">
        <ul>
            @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    </div>
@endif

<form action="{{ route('ropas.update', $ropa->id) }}" method="POST" enctype="multipart/form-data">
    @csrf
    @method('PUT')

    <input type="text" name="titulo" value="{{ $ropa->titulo }}" placeholder="Título" required><br><br>
    
    <textarea name="descripcion" required>{{ $ropa->descripcion }}</textarea><br><br>
    
    <input type="number" name="precio" step="0.01" value="{{ $ropa->precio }}" placeholder="Precio" required><br><br>
    
    <input type="number" name="cantidad" value="{{ $ropa->cantidad }}" placeholder="Cantidad" required><br><br>

    <label>Talla:</label>
    <select name="talla" required>
        <option value="S" {{ $ropa->talla == 'S' ? 'selected' : '' }}>S</option>
        <option value="M" {{ $ropa->talla == 'M' ? 'selected' : '' }}>M</option>
        <option value="L" {{ $ropa->talla == 'L' ? 'selected' : '' }}>L</option>
        <option value="XL" {{ $ropa->talla == 'XL' ? 'selected' : '' }}>XL</option>
    </select><br><br>

    <label>Categoría:</label>
    <select name="categoria" required>
        <option value="Camisa" {{ $ropa->categoria == 'Camisa' ? 'selected' : '' }}>Camisa</option>
        <option value="Pantalón" {{ $ropa->categoria == 'Pantalón' ? 'selected' : '' }}>Pantalón</option>
        <option value="Zapatilla" {{ $ropa->categoria == 'Zapatilla' ? 'selected' : '' }}>Zapatilla</option>
        <option value="Accesorio" {{ $ropa->categoria == 'Accesorio' ? 'selected' : '' }}>Accesorio</option>
    </select><br><br>

    <input type="text" name="genero" value="{{ $ropa->genero }}" placeholder="Género (Hombre/Mujer)" required><br><br>

    <label>Imagen actual:</label><br>
    @if($ropa->ruta_imagen)
        <img src="{{ asset('storage/' . $ropa->ruta_imagen) }}" width="150"><br><br>
    @endif

    <label>Subir nueva imagen (opcional):</label><br>
    <input type="file" name="imagen"><br><br>

    <button type="submit">Actualizar</button>
</form>
