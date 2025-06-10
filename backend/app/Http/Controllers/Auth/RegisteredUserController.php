<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\View\View;

class RegisteredUserController extends Controller
{
    /**
     * Mostrar vista de registro.
     */
    public function create(): View
    {
        return view('auth.register');
    }

    /**
     * Manejar la solicitud de registro.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'nombre'    => ['required', 'string', 'max:100'],
            'correo'    => ['required', 'string', 'email', 'max:100', 'unique:usuario,Correo_Electronico'],
            'password'  => ['required', 'confirmed', Rules\Password::defaults()],
            'tipo'      => ['nullable', 'in:Free,Premium,Admin'],
        ]);

        $user = User::create([
            'Nombre'             => $request->input('nombre'),
            'Correo_Electronico' => $request->input('correo'),
            'Contraseña'         => Hash::make($request->input('password')),
            'Tipo_Usuario'       => $request->input('tipo') ?? 'Free',
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect()->route('dashboard');
    }
}
