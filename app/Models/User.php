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

    // 🔐 Password field
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

    // 🧩 Relaciones
    public function ropas()
    {
        return $this->hasMany(Ropa::class, 'ID_Usuario');
    }

    public function accesorios()
    {
        return $this->hasMany(Accesorio::class, 'ID_Usuario');
    }

    // ⚙️ Borrado en cascada automático al eliminar un usuario
    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($user) {
            $user->ropas()->each(function ($ropa) {
                $ropa->delete();
            });

            $user->accesorios()->each(function ($accesorio) {
                $accesorio->delete();
            });
        });
    }
}
