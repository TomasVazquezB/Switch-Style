<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Talla extends Model
{
    protected $fillable = ['nombre'];

    /**
     * Relación con prendas usando tabla pivote (ropa_talla)
     * con acceso al campo 'cantidad'.
     */
    public function ropasConStock()
    {
        return $this->belongsToMany(Ropa::class, 'ropa_talla')
                    ->withPivot('cantidad')
                    ->withTimestamps();
    }
}
