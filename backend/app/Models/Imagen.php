<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Imagen extends Model
{
    protected $table = 'imagenes'; // 👈 nombre correcto

    protected $fillable = ['ruta', 'ropa_id'];

    public function ropa()
    {
        return $this->belongsTo(Ropa::class);
    }
}
