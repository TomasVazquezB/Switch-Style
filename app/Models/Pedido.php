<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pedido extends Model
{
    use HasFactory;

    protected $table = 'pedidos';

    protected $fillable = [
        'ID_Usuario',
        'subtotal',
        'total',
        'metodo_pago',
        'external_id',
        'estado',
        'direccion_envio',
    ];

    public $timestamps = true;
}
