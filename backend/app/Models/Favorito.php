<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Favorito extends Model
{
    protected $table = 'favoritos';

    protected $fillable = [
        'user_id',
        'favoritable_id',
        'favoritable_type',
    ];

    // Relación polimórfica con ropa o accesorio
    public function favoritable()
    {
        return $this->morphTo();
    }

    // Relación con el usuario
    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'user_id', 'ID_Usuario');
    }
}
