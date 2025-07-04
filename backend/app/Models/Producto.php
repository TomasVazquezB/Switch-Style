<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    protected $table = 'producto';

    protected $primaryKey = 'ID_Producto';

    public $timestamps = false;

    protected $fillable = [
        'Nombre',
        'Descripción',
        'Precio',
        'Tipo',
        'Imagen',
        'ID_Tienda'
    ];
}
