<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // Validación
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        // Buscar usuario usando Correo_Electronico
        $user = User::where('Correo_Electronico', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->Contraseña)) {
            return back()->withErrors([
                'email' => 'Las credenciales no coinciden',
            ])->withInput();
        }

        // Iniciar sesión manual
        Auth::login($user);
        $request->session()->regenerate();

        // Redirigir según tipo
        switch (strtolower($user->Tipo_Usuario)) {
            case 'admin':
                return redirect()->route('admin.dashboard');
            case 'free':
            case 'premium':
                return redirect()->route('dashboard');
            default:
                return redirect('/');
        }
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/login');
    }
}
