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
        'estilo',
    ];

    protected $casts = [
        'precio' => 'decimal:2',
        'estilo' => 'string',
    ];

    public function usuario()
    {
        return $this->belongsTo(User::class, 'ID_Usuario');
    }

    public function imagenes()
    {
        return $this->hasMany(Imagen::class, 'ropa_id');
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
        $id = $userId ?? optional(auth()->user())->ID_Usuario;
        return $id ? $query->where('ID_Usuario', $id) : $query;
    }

    public function scopeDelEstilo($query, $theme = null)
    {
        if (!$theme) return $query;

        $map = [
            'light'  => 'claro',
            'dark'   => 'oscuro',
            'claro'  => 'claro',
            'oscuro' => 'oscuro',
        ];

        $value = $map[strtolower($theme)] ?? null;
        return $value ? $query->where('estilo', $value) : $query;
    }
}
