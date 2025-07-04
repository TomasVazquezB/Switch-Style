<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Talla extends Model
{
    protected $fillable = ['nombre'];

    /**
     * Relación con prendas (ropa) usando tabla pivote ropa_talla
     */
    public function ropas()
    {
        return $this->belongsToMany(Ropa::class, 'ropa_talla')
                    ->withPivot('cantidad')
                    ->withTimestamps();
    }
}
