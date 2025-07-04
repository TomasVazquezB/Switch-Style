<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Categoria extends Model
{
    protected $fillable = ['nombre'];

    public function ropas()
    {
        return $this->hasMany(Ropa::class);
    }
}
