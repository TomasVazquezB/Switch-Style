<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        // Buscar usuario manualmente y comparar con MD5
        $user = DB::table('users')->where('email', $request->email)->first();

        if (!$user || $user->password !== md5($request->password)) {
            return response()->json(['message' => 'Credenciales inválidas'], 401);
        }

        // Loguear manualmente
        Auth::loginUsingId($user->id);
        $request->session()->regenerate();

        return response()->json($user);
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Sesión cerrada']);
    }

    public function user(Request $request)
    {
        return response()->json($request->user());
    }
}