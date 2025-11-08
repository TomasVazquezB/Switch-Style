<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pedido extends Model
{
    use HasFactory;

    protected $table = 'pedidos';
    protected $primaryKey = 'id';
    public $incrementing = true;
    public $timestamps = true;

    protected $fillable = [
        'ID_Usuario',
        'subtotal',
        'total',
        'metodo_pago',
        'external_id',
        'estado',
        'direccion_envio',
    ];

    public function usuario()
    {
        return $this->belongsTo(User::class, 'ID_Usuario', 'ID_Usuario');
    }
}
