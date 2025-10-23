<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Accesorio extends Model
{
    protected $table = 'accesorios';

    protected $fillable = [
        'titulo',
        'descripcion',
        'precio',
        'ruta_imagen',
        'stock',
        'categoria_id',
        'ID_Usuario',
        'estilo',
    ];

    protected $casts = [
        'precio' => 'decimal:2',
        'estilo' => 'string',
    ];

    protected $attributes = [
        'estilo' => 'claro',
    ];

    public function usuario()
    {
        return $this->belongsTo(User::class, 'ID_Usuario');
    }

    public function categoria()
    {
        return $this->belongsTo(Categoria::class, 'categoria_id');
    }

    public function imagenes()
    {
        return $this->hasMany(ImagenAccesorio::class, 'accesorio_id');
    }

    public function scopeDelEstilo($query, $theme = null)
    {
        if (!$theme) return $query;
        $map = [
            'light'  => 'claro',
            'dark'   => 'oscuro',
            'claro'  => 'claro',
            'oscuro' => 'oscuro',
        ];
        $value = $map[strtolower($theme)] ?? null;
        return $value ? $query->where('estilo', $value) : $query;
    }

    public function setEstiloAttribute($value): void
    {
        $v = strtolower((string) $value);
        $this->attributes['estilo'] = in_array($v, ['claro','oscuro'], true) ? $v : 'claro';
    }

    protected static function booted()
    {
        static::deleting(function (Accesorio $acc) {
            if (!empty($acc->ruta_imagen) && !preg_match('#^https?://#i', $acc->ruta_imagen)) {
                $disk = config('filesystems.default');
                if (Storage::disk($disk)->exists($acc->ruta_imagen)) {
                    Storage::disk($disk)->delete($acc->ruta_imagen);
                }
            }

            $acc->imagenes()->each(function ($img) {
                if (!empty($img->ruta) && !preg_match('#^https?://#i', $img->ruta)) {
                    $disk = config('filesystems.default');
                    if (Storage::disk($disk)->exists($img->ruta)) {
                        Storage::disk($disk)->delete($img->ruta);
                    }
                }
                $img->delete();
            });
        });
    }
}
