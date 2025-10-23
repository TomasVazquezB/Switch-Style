<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Imagen extends Model
{
    protected $table = 'imagenes';

    protected $fillable = ['ruta', 'ropa_id'];

    public function ropa()
    {
        return $this->belongsTo(Ropa::class, 'ropa_id');
    }

    protected static function booted()
    {
        static::deleting(function (Imagen $img) {
            if (!empty($img->ruta) && !preg_match('#^https?://#i', $img->ruta)) {
                $disk = config('filesystems.default');
                if (Storage::disk($disk)->exists($img->ruta)) {
                    Storage::disk($disk)->delete($img->ruta);
                }
            }
        });
    }
}
