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
    $request->validate([
        'email'    => 'required|email',
        'password' => 'required|string',
    ]);

    $user = User::where('Correo_Electronico', $request->email)->first();

    if (!$user || !Hash::check($request->password, $user->Contraseña)) {
        return back()->withErrors([
            'email' => 'Las credenciales no coinciden',
        ])->withInput();
    }

    Auth::login($user);
    $request->session()->regenerate();

    // 🔐 Redirección basada en el tipo de usuario
    switch (strtolower($user->Tipo_Usuario)) {
        case 'admin':
            return redirect()->route('admin.dashboard');
        case 'free':
        case 'premium':
        case 'usuario':
        default:
            return redirect()->route('dashboard');
    }
}

}
