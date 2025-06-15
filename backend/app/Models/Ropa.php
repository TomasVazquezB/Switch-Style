<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ropa extends Model
{
    protected $table = 'ropas';

    protected $fillable = [
        'titulo',
        'descripcion',
        'precio',
        'ruta_imagen',
        'categoria_id',
        'genero_id',
        'ID_Usuario',
    ];

    public function usuario()
    {
        return $this->belongsTo(User::class, 'ID_Usuario');
    }

    public function imagenes()
    {
        return $this->hasMany(Imagen::class);
    }

    public function categoria()
    {
        return $this->belongsTo(Categoria::class);
    }

    public function genero()
    {
        return $this->belongsTo(Genero::class);
    }

    public function tallas()
    {
        return $this->belongsToMany(Talla::class, 'ropa_talla')
                    ->withPivot('cantidad')
                    ->withTimestamps();
    }

    public function scopePropias($query, $userId = null)
    {
        return $query->where('ID_Usuario', $userId ?? auth()->id());
    }
}
