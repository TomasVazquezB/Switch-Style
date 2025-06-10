<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;

class User extends Authenticatable
{
    use Notifiable;

    protected $table = 'usuario';
    protected $primaryKey = 'ID_Usuario';
    public $timestamps = false;

    protected $fillable = [
        'Nombre',
        'Correo_Electronico',
        'Contraseña',
        'Tipo_Usuario',
    ];

    protected $hidden = [
        'Contraseña',
        'remember_token',
    ];

    /**
     * Devuelve el nombre de la clave primaria (para Auth)
     */
    public function getAuthIdentifierName()
    {
        return $this->primaryKey; // Esto es 'ID_Usuario'
    }

    /**
     * Devuelve el campo de contraseña para Auth
     */
    public function getAuthPassword()
    {
        return $this->Contraseña;
    }

    /**
     * Devuelve el nombre del campo usado como login
     */
    public function username()
    {
        return 'Correo_Electronico';
    }
}
