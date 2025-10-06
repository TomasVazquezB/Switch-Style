<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable; // 🔹 Agregado HasApiTokens para Sanctum

    protected $table = 'usuario'; // tu tabla personalizada
    protected $primaryKey = 'ID_Usuario';
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

    // 🔹 Laravel sabrá qué columna usar para verificar la contraseña
    public function getAuthPassword()
    {
        return $this->Contraseña;
    }

    // 🔹 Login usando el email (Correo_Electronico)
    public function getAuthIdentifierName()
    {
        return 'Correo_Electronico';
    }

    // 🔹 Para restablecer contraseña (si lo usas)
    public function getEmailForPasswordReset()
    {
        return $this->Correo_Electronico;
    }
}
