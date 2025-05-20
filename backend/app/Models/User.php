<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    
    protected $table = 'usuario';
    protected $primaryKey = 'ID_Usuario';
    public $timestamps = false;

    protected $fillable = [
        'Nombre',
        'Correo_Electronico',
        'Contraseña',
        'Tipo_Usuario',
    ];

    
    protected $hidden = ['Contraseña','remember_token'];

    public function getAuthIdentifierName()
    {
        return 'ID_Usuario'; // o 'id' si Laravel lo espera como clave primaria
    }

    public function getAuthPassword()
    {
        return $this->Contraseña; // 👈 importante para Auth::attempt o Hash::check
    }
    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
