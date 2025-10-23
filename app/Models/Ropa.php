<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Storage;

class Ropa extends Model
{
    protected $table = 'ropas';

    protected $fillable = [
        'titulo','descripcion','precio','ruta_imagen',
        'categoria_id','genero_id','ID_Usuario','estilo',
    ];

    protected $casts = [
        'precio' => 'decimal:2',
        'estilo' => 'string',
    ];

    protected $with = ['usuario','imagenes'];

    public function usuario()   { return $this->belongsTo(User::class, 'ID_Usuario'); }
    public function imagenes()  { return $this->hasMany(Imagen::class, 'ropa_id'); }
    public function categoria() { return $this->belongsTo(Categoria::class); }
    public function genero()    { return $this->belongsTo(Genero::class); }

    public function tallas()
    {
        return $this->belongsToMany(Talla::class, 'ropa_talla')
            ->withPivot('cantidad')->withTimestamps();
    }

    public function scopePropias($query, $userId = null)
    {
        return $query->where('ID_Usuario', $userId ?? auth()->id());
    }

    public function scopeDelEstilo($query, $estilo = null)
    {
        if (!$estilo) return $query;
        $estilo = strtolower($estilo);
        if (!in_array($estilo, ['claro','oscuro'])) return $query;
        return $query->where('estilo', $estilo);
    }

    protected static function booted()
    {
        static::addGlobalScope('withExistingUser', function (Builder $q) {
            $q->whereHas('usuario');
        });

        static::deleting(function (Ropa $ropa) {
            if (!empty($ropa->ruta_imagen) && !preg_match('#^https?://#i', $ropa->ruta_imagen)) {
                $disk = config('filesystems.default');
                if (Storage::disk($disk)->exists($ropa->ruta_imagen)) {
                    Storage::disk($disk)->delete($ropa->ruta_imagen);
                }
            }

            $ropa->imagenes()->each(function ($img) {
                if (!empty($img->ruta) && !preg_match('#^https?://#i', $img->ruta)) {
                    $disk = config('filesystems.default');
                    if (Storage::disk($disk)->exists($img->ruta)) {
                        Storage::disk($disk)->delete($img->ruta);
                    }
                }
                $img->delete();
            });

            $ropa->tallas()->detach();
        });
    }
}
