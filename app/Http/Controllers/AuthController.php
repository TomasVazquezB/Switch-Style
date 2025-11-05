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
    // 1. VALIDACIÓN (misma lógica que el método web)
    $request->validate([
        'nombre'  => 'required|string|max:100',
        'correo'  => 'required|email|unique:usuario,Correo_Electronico',
        'password'=> 'required|string|min:6',
        'tipo'    => 'nullable|string|in:Free,Premium,Admin,Usuario',
    ]);

    try {
        // 2. CREACIÓN: Usamos User::create() para que el modelo Eloquent sea válido.
        // Esto previene el Error 500 al llamar a $user->createToken().
        $user = User::create([
            'Nombre'            => $request->nombre,
            'Correo_Electronico'=> $request->correo,
            // Usar Hash::make asegura compatibilidad con el login del sitio web y móvil.
            'Contraseña'        => Hash::make($request->password), 
            'Tipo_Usuario'      => $request->tipo ?? 'Usuario',
        ]);
        
        // 3. GENERACIÓN del Token Sanctum
        $token = $user->createToken('auth_token')->plainTextToken;
        $id = $user->ID_Usuario; 

        // 4. RESPUESTA EXITOSA (201 Created)
        return response()->json([
            'message' => 'Usuario registrado exitosamente',
            'user' => [ // Usamos 'user' como clave para que sea fácil de manejar en Android
                'id'     => $id,
                'nombre' => $request->nombre,
                'correo' => $request->correo,
                'rol'    => $request->tipo ?? 'Usuario',
            ],
            'token' => $token, 
        ], 201);

    } catch (\Exception $e) {
        // En caso de que la validación falle o haya un error de base de datos
        \Log::error('Error en registerMobile: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
        return response()->json(['message' => 'Error interno del servidor al registrar. Por favor, revise el Logcat.'], 500);
    }
}
    
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        Auth::logout();

        return response()->json(['message' => 'Logout exitoso']);
    }
}
