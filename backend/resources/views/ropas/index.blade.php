<h2>Listado de ropa</h2>
<a href="{{ route('ropas.create') }}">Nueva prenda</a><br><br>

@foreach($ropas as $ropa)
    <div>
        <h3>{{ $ropa->titulo }}</h3>
        <img src="{{ asset('storage/' . $ropa->ruta_imagen) }}" width="150"><br>
        <p>{{ $ropa->descripcion }}</p>
        <p>${{ $ropa->precio }}</p>
        <p>Talla: {{ $ropa->talla }} | Categoría: {{ $ropa->categoria }} | Género: {{ $ropa->genero }}</p>
        <p>Cantidad: {{ $ropa->cantidad }}</p>
    </div><hr>
@endforeach

<a href="{{ route('ropas.edit', $ropa->id) }}">Editar</a>


<form action="{{ route('ropas.destroy', $ropa->id) }}" method="POST" onsubmit="return confirm('¿Eliminar prenda?')">
    @csrf
    @method('DELETE')
    <button type="submit">Eliminar</button>
</form>
