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

        // Buscar por correo correcto
        $user = User::where('Correo_Electronico', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 401);
        }

        if ($user->Contraseña === $request->password) {
            // Contraseña sin encriptar → la migramos a bcrypt
            $user->Contraseña = bcrypt($request->password);
            $user->save();

            Auth::loginUsingId($user->ID_Usuario);
        } elseif (Hash::check($request->password, $user->Contraseña)) {
            Auth::loginUsingId($user->ID_Usuario);
        } else {
            return response()->json(['message' => 'Credenciales inválidas'], 401);
        }

        $request->session()->regenerate();

        return response()->json([
            'id' => $user->ID_Usuario,
            'nombre' => $user->Nombre,
            'correo' => $user->Correo_Electronico,
            'rol' => $user->Tipo_Usuario,
        ]);

    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Sesión cerrada']);
    }
}
