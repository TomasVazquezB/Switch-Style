<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\ImagenAccesorio;

class Accesorio extends Model
{
    protected $table = 'accesorios';

    protected $fillable = [
        'titulo',
        'descripcion',
        'precio',
        'ruta_imagen',
        'stock', // ← AGREGADO
        'categoria_id',
        'ID_Usuario',
    ];

    public function usuario()
    {
        return $this->belongsTo(User::class, 'ID_Usuario');
    }

    public function categoria()
    {
        return $this->belongsTo(Categoria::class, 'categoria_id');
    }

    public function imagenes()
    {
        return $this->hasMany(ImagenAccesorio::class, 'accesorio_id');
    }
}
