<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ImagenAccesorio extends Model
{
    protected $table = 'imagenes_accesorios';

    protected $fillable = [
        'ruta',
        'accesorio_id',
    ];

    public function accesorio()
    {
        return $this->belongsTo(Accesorio::class);
    }
}
