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
            'password'           => ['required'],
        ]);

        
        $remember = $request->filled('remember'); 
        if (! Auth::attempt([
            'Correo_Electronico' => $credentials['Correo_Electronico'],
            'password'           => $credentials['password'],
        ], $remember)) {
            throw ValidationException::withMessages([
                'Correo_Electronico' => __('Estas credenciales no coinciden con nuestros registros.'),
            ])->redirectTo(route('login'));
        }

        
        $request->session()->regenerate();

        $user = Auth::user();
        $isActive = $user->is_active ?? ($user->Activo ?? true);
        if (! $isActive) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            throw ValidationException::withMessages([
                'Correo_Electronico' => 'Tu cuenta está inactiva. Contactá al administrador.',
            ])->redirectTo(route('login'));
        }

        $tipo = strtolower($user->Tipo_Usuario ?? '');
        return match ($tipo) {
            'admin'           => redirect()->route('inicio'),
            'free', 'premium' => redirect()->route('inicio'),
            default           => redirect('/'),
        };
    }

    public function destroy(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/');
    }
}
