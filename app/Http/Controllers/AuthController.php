<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class AuthController extends Controller
{
    /**
     * 🔹 LOGIN de usuario (para Android o API)
     */
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        // Buscar el usuario en la tabla personalizada
        $user = User::where('Correo_Electronico', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->Contraseña)) {
            return response()->json(['message' => 'Credenciales inválidas'], 401);
        }

        // Crear token de acceso (Sanctum)
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login exitoso',
            'user' => [
                'id'     => $user->ID_Usuario,
                'nombre' => $user->Nombre,
                'correo' => $user->Correo_Electronico,
                'rol'    => $user->Tipo_Usuario,
            ],
            'token' => $token,
        ]);
    }

    /**
     * 🔹 REGISTRO de usuario
     */
    public function register(Request $request)
    {
        $request->validate([
            'nombre'  => 'required|string|max:100',
            'correo'  => 'required|email|unique:usuario,Correo_Electronico',
            'password'=> 'required|string|min:6',
            'tipo'    => 'nullable|string|in:Free,Premium,Admin,Usuario',
        ]);

        // Crear el usuario
        $user = User::create([
            'Nombre'            => $request->nombre,
            'Correo_Electronico'=> $request->correo,
            'Contraseña'        => bcrypt($request->password),
            'Tipo_Usuario'      => $request->tipo ?? 'Usuario',
            'Fecha_Registro'    => now(),
        ]);

        // Crear token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Usuario registrado exitosamente',
            'usuario' => [
                'id'     => $user->ID_Usuario,
                'nombre' => $user->Nombre,
                'correo' => $user->Correo_Electronico,
                'rol'    => $user->Tipo_Usuario,
            ],
            'token' => $token,
        ], 201);
    }

    /**
     * 🔹 CERRAR SESIÓN (revocar token actual)
     */
    public function logout(Request $request)
    {
        $user = $request->user();

        if ($user) {
            $user->currentAccessToken()->delete();
        }

        return response()->json(['message' => 'Logout exitoso']);
    }

    /**
     * 🔹 OBTENER USUARIO AUTENTICADO
     */
    public function me(Request $request)
    {
        $user = $request->user();

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
