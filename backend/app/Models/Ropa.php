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
        'cantidad',
        'talla',
        'categoria',
        'genero',
    ];
}



