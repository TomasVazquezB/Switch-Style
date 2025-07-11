<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    protected $table = 'ropas'; // 👈 importante
    protected $primaryKey = 'id'; // por defecto igual es esto
    public $timestamps = true;

    protected $fillable = [
        'titulo',
        'descripcion',
        'precio',
        'categoria_id',
        'genero_id',
        'ID_Usuario',
        'ruta_imagen'
    ];
}
