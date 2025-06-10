<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

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
        $request->validate([
            'Nombre' => 'required|string|max:255',
            'Correo_Electronico' => 'required|email|unique:users,Correo_Electronico,' . auth()->id(),
        ]);

        $user = auth()->user();
        $user->Nombre = $request->Nombre;
        $user->Correo_Electronico = $request->Correo_Electronico;
        $user->save();

        return back()->with('success', 'Datos actualizados correctamente.');
    }

    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if (!Hash::check($request->current_password, auth()->user()->password)) {
            return back()->withErrors(['current_password' => 'La contraseña actual no es correcta.']);
        }

        $user = auth()->user();
        $user->password = bcrypt($request->password);
        $user->save();

        return back()->with('success', 'Contraseña actualizada correctamente.');
    }
}
