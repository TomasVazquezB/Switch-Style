<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    protected $table = 'usuario';              // Nombre real de la tabla
    protected $primaryKey = 'ID_Usuario';      // PK real
    public $timestamps = false;                // No tienes created_at/updated_at
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'Nombre',
        'Correo_Electronico',
        'Contraseña',
        'Tipo_Usuario',
        'is_active', 
    ];

    protected $hidden = [
        'Contraseña',
        'remember_token',
    ];

    protected $casts = [
        'is_active' => 'boolean',
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
