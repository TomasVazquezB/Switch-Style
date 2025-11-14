<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthenticatedSessionController extends Controller
{
    public function create()
    {
        return view('auth.login');
    }

    public function store(Request $request)
{
    $credentials = $request->validate([
        'Correo_Electronico' => ['required', 'email'],
        'password' => ['required'],
    ]);

    if (!Auth::attempt([
        'Correo_Electronico' => $credentials['Correo_Electronico'],
        'password' => $credentials['password']
    ], $request->filled('remember'))) {
        throw ValidationException::withMessages([
            'Correo_Electronico' => __('Estas credenciales no coinciden con nuestros registros.'),
        ]);
    }

    $request->session()->regenerate();

    $tipo = strtolower(Auth::user()->Tipo_Usuario);

    return match ($tipo) {
        'admin' => redirect()->route('inicio'), // ✅ aquí va directamente a la tabla
        'free', 'premium' => redirect()->route('inicio'),
        default => redirect('/'),
    };
}



public function destroy(Request $request)
{
    Auth::logout();

    $request->session()->invalidate();
    $request->session()->regenerateToken();

    return redirect()->away(config('app.frontend_url', 'https://switchstyle.vercel.app'));
}


}
