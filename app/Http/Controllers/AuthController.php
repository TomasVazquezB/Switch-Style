<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class AuthController extends Controller
{
    /**
     * Login de usuario
     */
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        // Buscar usuario en la tabla personalizada "usuario"
        $user = DB::table('usuario')->where('Correo_Electronico', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->Contraseña)) {
            return response()->json(['message' => 'Credenciales inválidas'], 401);
        }

        // Loguear usando el guard de Auth
        $userModel = User::where('Correo_Electronico', $request->email)->first();
        Auth::login($userModel);

        // Regenerar sesión
        $request->session()->regenerate();

        return response()->json([
            'message' => 'Login exitoso',
            'user' => [
                'id'     => $user->ID_Usuario,
                'nombre' => $user->Nombre,
                'correo' => $user->Correo_Electronico,
                'rol'    => $user->Tipo_Usuario,
            ],
        ]);
    }

    /**
     * Registro de usuario
     */
    public function register(Request $request)
    {
        $request->validate([
            'nombre'  => 'required|string|max:100',
            'correo'  => 'required|email|unique:usuario,Correo_Electronico',
            'password'=> 'required|string|min:6',
            'tipo'    => 'nullable|string|in:Free,Premium,Admin,Usuario',
        ]);

        $id = DB::table('usuario')->insertGetId([
            'Nombre'          => $request->nombre,
            'Correo_Electronico' => $request->correo,
            'Contraseña'      => bcrypt($request->password),
            'Tipo_Usuario'    => $request->tipo ?? 'Usuario',
            'Fecha_Registro'  => now(),
        ]);

        return response()->json([
            'message' => 'Usuario registrado exitosamente',
            'usuario' => [
                'id'     => $id,
                'nombre' => $request->nombre,
                'correo' => $request->correo,
                'rol'    => $request->tipo ?? 'Usuario',
            ],
        ], 201);
    }

    /**
     * Logout
     */
    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Logout exitoso']);
    }

    /**
     * Obtener usuario autenticado
     */
    public function me(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'No autenticado'], 401);
        }

        return response()->json([
            'id'     => $user->ID_Usuario,
            'nombre' => $user->Nombre,
            'correo' => $user->Correo_Electronico,
            'rol'    => $user->Tipo_Usuario,
        ]);
    }
}
