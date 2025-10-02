<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    protected $table = 'usuario';
    protected $primaryKey = 'ID_Usuario';
    public $timestamps = false;

    public $incrementing = true; // ✅ Asegura que Laravel lo trate como autoincrement
    protected $keyType = 'int';  // ✅ Para evitar problemas si Laravel espera string

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

    public function getAuthPassword()
    {
        return $this->Contraseña;
    }

    public function getAuthIdentifierName()
    {
        return 'ID_Usuario';
    }

    public function getEmailForPasswordReset()
    {
        return $this->Correo_Electronico;
    }
}
