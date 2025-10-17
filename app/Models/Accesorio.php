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
        'stock',
        'categoria_id',
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

    public function categoria()
    {
        return $this->belongsTo(Categoria::class, 'categoria_id');
    }

    public function imagenes()
    {
        return $this->hasMany(ImagenAccesorio::class, 'accesorio_id');
    }

    /**
     * Filtra por tema (modo claro/oscuro)
     * Acepta ?theme=light|dark o 'claro'|'oscuro'
     */
    public function scopeDelEstilo($query, $theme)
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
