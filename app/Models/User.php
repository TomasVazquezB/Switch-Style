<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class User extends Authenticatable
{
    use Notifiable;

    protected $table = 'usuario';
    protected $primaryKey = 'ID_Usuario';
    public $timestamps = false;
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

   
    public function setContraseñaAttribute($value)
    {
        if ($value) {
            $this->attributes['Contraseña'] = Str::startsWith($value, '$2y$')
                ? $value 
                : Hash::make($value);
        }
    }

    
}
