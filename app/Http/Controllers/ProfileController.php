<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
{
    public function edit()
    {
        return view('profile.edit', [
            'user' => auth()->user(),
        ]);
    }

    public function update(Request $request)
    {
        $user = auth()->user();

        $request->validate([
            'Nombre' => 'required|string|max:255',
            'Correo_Electronico' => [
                'required','email','max:255',
                Rule::unique('usuario','Correo_Electronico')
                    ->ignore($user->ID_Usuario, 'ID_Usuario'),
            ],
        ]);

        $user->Nombre = $request->Nombre;
        $user->Correo_Electronico = $request->Correo_Electronico;
        $user->save();

        return back()->with('success', 'Datos actualizados correctamente.');
    }

    public function updatePassword(Request $request)
    {
        $user = auth()->user();

        $request->validate([
            'current_password' => 'required',
            'password' => 'required|string|min:8|confirmed',
        ]);

        // comparar contra la columna correcta (Contraseña)
        if (!Hash::check($request->current_password, $user->Contraseña)) {
            return back()->withErrors(['current_password' => 'La contraseña actual no es correcta.']);
        }

        // mutator en el modelo se encarga de hashear
        $user->Contraseña = $request->password;
        $user->save();

        return back()->with('success', 'Contraseña actualizada correctamente.');
    }
}
