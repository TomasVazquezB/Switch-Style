<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $table = 'usuario';
    protected $primaryKey = 'ID_Usuario';
    public $timestamps = false;

    protected $fillable = [
        'Nombre',
        'Correo_Electronico',
        'Contraseña',
        'Tipo_Usuario',
    ];

    protected $hidden = ['Contraseña', 'remember_token'];

    public function getAuthIdentifierName()
    {
        return 'ID_Usuario';
    }

    public function getAuthPassword()
    {
        return $this->Contraseña;
    }

    public function setContraseñaAttribute($value)
    {
        if (!empty($value) && !Hash::needsRehash($value)) {
            $this->attributes['Contraseña'] = bcrypt($value);
        } else {
            $this->attributes['Contraseña'] = $value;
        }
    }

    // Roles
    public function esAdmin(): bool
    {
        return $this->Tipo_Usuario === 'Admin';
    }

    public function esPremium(): bool
    {
        return $this->Tipo_Usuario === 'Premium';
    }

    public function esFree(): bool
    {
        return $this->Tipo_Usuario === 'Free';
    }

    public function puedeVender(): bool
    {
        return in_array($this->Tipo_Usuario, ['Premium', 'Free', 'Admin']);
    }

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
        ];
    }
}
