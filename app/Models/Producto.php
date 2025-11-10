<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    use HasFactory;

    /**
     * Nombre de la tabla en la base de datos.
     * Si tu tabla se llama "productos", cambialo a 'productos'
     */
    protected $table = 'producto';

    /**
     * Clave primaria de la tabla.
     * Asegurate que coincida con el nombre real en tu base de datos
     */
    protected $primaryKey = 'ID_Producto';

    /**
     * Si tu tabla NO tiene las columnas created_at y updated_at
     */
    public $timestamps = false;

    /**
     * Campos que pueden ser asignados masivamente (fillable)
     * Estos deben coincidir con las columnas en tu tabla
     */
    protected $fillable = [
        'Nombre',
        'Precio',
        'Descripción',
        'Tipo',
        'Imagen',
        'ID_Tienda'
    ];

    /**
     * (Opcional) Accesor para generar automáticamente la URL completa de la imagen
     * Ejemplo: $producto->imagen_url
     */
    protected $appends = ['imagen_url'];

    public function getImagenUrlAttribute()
    {
        return asset('storage/' . $this->Imagen);
    }

    /**
     * (Opcional) Si querés definir la relación con Tienda
     * Esto sirve si tenés un modelo Tienda.php
     */
    public function tienda()
    {
        return $this->belongsTo(Tienda::class, 'ID_Tienda', 'ID_Tienda');
    }
}
