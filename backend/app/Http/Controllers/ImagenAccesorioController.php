<?php

namespace App\Http\Controllers;

use App\Models\ImagenAccesorio;
use App\Models\Accesorio;
use Illuminate\Support\Facades\Storage;

class ImagenAccesorioController extends Controller
{
    public function destroy($id)
    {
        $imagen = ImagenAccesorio::findOrFail($id);
        $accesorio = $imagen->accesorio;

        // Eliminar archivo físico si existe
        if ($imagen->ruta && Storage::disk('public')->exists($imagen->ruta)) {
            Storage::disk('public')->delete($imagen->ruta);
        }

        // Limpiar imagen principal si era esa
        if ($accesorio->ruta_imagen === $imagen->ruta) {
            $accesorio->update(['ruta_imagen' => null]);
        }

        $imagen->delete();

        return back()->with('success', 'Imagen eliminada correctamente.');
    }

    public function marcarComoPrincipal($id)
    {
        $imagen = ImagenAccesorio::findOrFail($id);
        $accesorio = $imagen->accesorio;

        $accesorio->update([
            'ruta_imagen' => $imagen->ruta,
        ]);

        return back()->with('success', 'Imagen marcada como principal.');
    }
}
