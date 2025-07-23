<?php

namespace App\Http\Controllers;

use App\Models\Imagen;
use Illuminate\Support\Facades\Storage;

class ImagenController extends Controller
{
    public function destroy(Imagen $imagen)
    {
        if ($imagen->ruta && Storage::disk('public')->exists($imagen->ruta)) {
            Storage::disk('public')->delete($imagen->ruta);
        }

        $ropaId = $imagen->ropa_id;
        $imagen->delete();

        return redirect()->route('ropas.edit', $ropaId)->with('success', 'Imagen eliminada.');
    }

    public function setAsPrincipal(Imagen $imagen)
    {
        $ropa = $imagen->ropa;
        $ropa->update(['ruta_imagen' => $imagen->ruta]);

        return redirect()->route('ropas.edit', $ropa->id)->with('success', 'Imagen establecida como principal.');
    }
}