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
        return back()->withErrors(['email' => 'Credenciales inválidas']);
    }

    Auth::login($user);
    $request->session()->regenerate();

    return redirect()->intended('/inicio'); // ✅ Redirige al dashboard o página inicial
}

     public function register(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:100',
            'correo' => 'required|email|unique:usuario,Correo_Electronico',
            'password' => 'required|string|min:6',
            'tipo' => 'nullable|string|in:Free,Premium,Admin,Usuario',
        ]);

        $id = DB::table('usuario')->insertGetId([
            'Nombre' => $request->nombre,
            'Correo_Electronico' => $request->correo,
            'Contraseña' => bcrypt($request->password),
            'Tipo_Usuario' => $request->tipo ?? 'Usuario',
            'Fecha_Registro' => now(),
        ]);

        return response()->json([
            'message' => 'Usuario registrado exitosamente',
            'usuario' => [
                'id' => $id,
                'nombre' => $request->nombre,
                'correo' => $request->correo,
                'rol' => $request->tipo ?? 'Usuario',
            ],
        ], 201);
    }


    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/login');
    }
}