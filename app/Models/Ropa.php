<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ropa extends Model
{
    protected $table = 'ropas';

    protected $fillable = [
        'titulo','descripcion','precio','ruta_imagen',
        'categoria_id','genero_id','ID_Usuario','estilo',
    ];

    protected $casts = [
        'precio' => 'decimal:2',
        'estilo' => 'string',
    ];

    // Relaciones
    public function usuario()   { return $this->belongsTo(User::class, 'ID_Usuario'); }
    public function imagenes()  { return $this->hasMany(Imagen::class, 'ropa_id'); }
    public function categoria() { return $this->belongsTo(Categoria::class); }
    public function genero()    { return $this->belongsTo(Genero::class); }
    public function tallas()
    {
        return $this->belongsToMany(Talla::class, 'ropa_talla')
            ->withPivot('cantidad')->withTimestamps();
    }

    // Scope propias (según tu proyecto)
    public function scopePropias($query, $userId = null)
    {
        return $query->where('ID_Usuario', $userId ?? auth()->id());
    }

    // Scope de estilo (claro/oscuro)
    public function scopeDelEstilo($query, $estilo = null)
    {
        if (!$estilo) return $query;
        $estilo = strtolower($estilo);
        if (!in_array($estilo, ['claro','oscuro'])) return $query;
        return $query->where('estilo', $estilo);
    }
}
