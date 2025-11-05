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

    public function register(Request $request)
    {
        $request->validate([
            'nombre'  => 'required|string|max:100',
            'correo'  => 'required|email|unique:usuario,Correo_Electronico',
            'password'=> 'required|string|min:6',
            'tipo'    => 'nullable|string|in:Free,Premium,Admin,Usuario',
        ]);

        $id = DB::table('usuario')->insertGetId([
            'Nombre'            => $request->nombre,
            'Correo_Electronico'=> $request->correo,
            'Contraseña'        => bcrypt($request->password),
            'Tipo_Usuario'      => $request->tipo ?? 'Usuario',
            'Fecha_Registro'    => now(),
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
    }

public function registerMobile(Request $request)
    {
        // 1. VALIDACIÓN
        $request->validate([
            'nombre'  => 'required|string|max:100',
            'correo'  => 'required|email|unique:usuario,Correo_Electronico',
            'password'=> 'required|string|min:6',
            'tipo'    => 'nullable|string|in:Free,Premium,Admin,Usuario',
        ]);

        try {
            // 2. CREACIÓN: Usamos User::create() para que el modelo Eloquent sea válido.
            $user = User::create([
                'Nombre'            => $request->nombre,
                'Correo_Electronico'=> $request->correo,
                // Clave: Usamos Hash::make() para la compatibilidad con el login
                'Contraseña'        => Hash::make($request->password), 
                'Tipo_Usuario'      => $request->tipo ?? 'Usuario',
                // Eliminamos Fecha_Registro para evitar fallos de DB si es NOT NULL 
                // o no se autocompleta.
            ]);
            
            // 3. GENERACIÓN del Token Sanctum
            $token = $user->createToken('auth_token')->plainTextToken;
            $id = $user->ID_Usuario; 

            // 4. RESPUESTA EXITOSA (201 Created)
            return response()->json([
                'message' => 'Usuario registrado exitosamente',
                'user' => [ // Clave 'user' para Android
                    'id'     => $id,
                    'nombre' => $request->nombre,
                    'correo' => $request->correo,
                    'rol'    => $request->tipo ?? 'Usuario',
                ],
                'token' => $token, 
            ], 201);

        } catch (\Illuminate\Database\QueryException $e) {
            // Manejo de errores de Base de Datos que devolverá el mensaje real
            $errorMessage = $e->getMessage();
            \Log::error('Error de BD en registerMobile: ' . $errorMessage);
            
            // Esto le dará a tu Logcat de Android la pista para el fallo real.
            return response()->json([
                'message' => 'Error al registrar el usuario. Contacte al administrador.', 
                'error_detail' => $errorMessage
            ], 500);
            
        } catch (\Exception $e) {
            // Otros errores
            \Log::error('Error Gral en registerMobile: ' . $e->getMessage());
            return response()->json(['message' => 'Error interno del servidor.'], 500);
        }
    }
    
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        Auth::logout();

        return response()->json(['message' => 'Logout exitoso']);
    }
}
