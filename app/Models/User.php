<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    protected $table = 'usuario'; // tu tabla personalizada
    protected $primaryKey = 'ID_Usuario'; // tu PK
    public $timestamps = false;

    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'Nombre',
        'Correo_Electronico',
        'Contraseña',
        'Tipo_Usuario',
        'Fecha_Registro',
    ];

    protected $hidden = [
        'Contraseña',
    ];

    // Laravel sabe que este campo es la contraseña
    public function getAuthPassword()
    {
        return $this->Contraseña;
    }

    // Para login usando el email
    public function getAuthIdentifierName()
    {
        return 'Correo_Electronico';
    }

    public function getEmailForPasswordReset()
    {
        return $this->Correo_Electronico;
    }
}
