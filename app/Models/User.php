<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use Notifiable, HasApiTokens;

    protected $table = 'usuario';
    protected $primaryKey = 'ID_Usuario';
    public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = false;

    protected $fillable = [
        'Nombre',
        'Correo_Electronico',
        'Contraseña',
        'Tipo_Usuario',
        'Fecha_Registro',
    ];

    protected $hidden = ['Contraseña'];

    public function getAuthPassword()
    {
        return $this->Contraseña;
    }

    public function getAuthIdentifierName()
    {
        return 'ID_Usuario';
    }

    public function username()
    {
        return 'Correo_Electronico';
    }
}
