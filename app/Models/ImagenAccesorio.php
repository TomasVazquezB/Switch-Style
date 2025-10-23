<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class ImagenAccesorio extends Model
{
    protected $table = 'imagenes_accesorios';

    protected $fillable = ['ruta', 'accesorio_id', 'es_principal'];

    protected $appends = ['url'];

    public function accesorio()
    {
        return $this->belongsTo(Accesorio::class, 'accesorio_id');
    }

    public function getUrlAttribute(): ?string
    {
        if (!$this->ruta) return null;
        if (preg_match('#^https?://#i', $this->ruta)) return $this->ruta;
        $disk = config('filesystems.default');
        return Storage::disk($disk)->exists($this->ruta) ? Storage::disk($disk)->url($this->ruta) : null;
    }

    protected static function booted()
    {
        static::deleting(function (ImagenAccesorio $img) {
            if (!empty($img->ruta) && !preg_match('#^https?://#i', $img->ruta)) {
                $disk = config('filesystems.default');
                if (Storage::disk($disk)->exists($img->ruta)) {
                    Storage::disk($disk)->delete($img->ruta);
                }
            }
        });
    }
}
