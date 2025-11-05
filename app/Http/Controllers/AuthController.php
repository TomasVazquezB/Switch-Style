<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request)
    {

        // 🔍 DEBUG TEMPORAL — ver qué middleware se están aplicando
        if ($request->has('debug')) {
            return response()->json([
                'debug' => [
                    'middleware' => app('router')->getCurrentRoute()->gatherMiddleware(),
                    'cookies' => $request->cookies->all(),
                    'headers' => $request->headers->all(),
                ],
            ]);
        }
        
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('Correo_Electronico', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->Contraseña)) {
            return response()->json(['message' => 'Credenciales inválidas'], 401);
        }

        // Crear token Sanctum
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

    // =======================================================
    // ✅ FUNCIÓN ORIGINAL: Se mantiene para la Web (Genera Token)
    // =======================================================
    public function register(Request $request)
    {
        $request->validate([
            'nombre'  => 'required|string|max:100',
            'correo'  => 'required|email|unique:usuario,Correo_Electronico',
            'password'=> 'required|string|min:6',
            'tipo'    => 'nullable|string|in:Free,Premium,Admin,Usuario',
        ]);

        $id = DB::table('usuario')->insertGetId([
            'Nombre'             => $request->nombre,
            'Correo_Electronico'=> $request->correo,
            'Contraseña'         => bcrypt($request->password),
            'Tipo_Usuario'       => $request->tipo ?? 'Usuario',
            'Fecha_Registro'     => now(),
        ]);

        $user = User::find($id);
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Usuario registrado exitosamente',
            'usuario' => [
                'id'     => $id,
                'nombre' => $request->nombre,
                'correo' => $request->correo,
                'rol'    => $request->tipo ?? 'Usuario',
            ],
            'token' => $token,
        ], 201);

        } catch (\Exception $e) {
        // 🚨 ESTE BLOQUE SE ACTIVARÁ CON EL ERROR EXACTO 🚨
        return response()->json([
            'status' => 'error_debug',
            'message' => 'Fallo de inserción o modelo. ¡Verifique el error en la línea!',
            'error_detalle_completo' => $e->getMessage(),
            'line' => $e->getLine(), // <-- La línea de error
            'file' => $e->getFile(),
        ], 200); // <-- CÓDIGO 200 CLAVE para evitar censura
    }
}
    // =======================================================
    // Funcción de Logout (Se mantiene igual)
    // =======================================================
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        Auth::logout();

        return response()->json(['message' => 'Logout exitoso']);
    }
}
