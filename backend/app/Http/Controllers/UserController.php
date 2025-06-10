<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        $usuarios = User::all();
        return view('admin.usuarios.index', compact('usuarios'));
    }

    public function create()
    {
        return view('admin.usuarios.create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'Correo_Electronico' => 'required|email|unique:users',
            'password' => 'required|confirmed',
            'Tipo_Usuario' => 'required|in:admin,free,premium',
        ]);

        User::create([
            'name' => $request->name,
            'Correo_Electronico' => $request->Correo_Electronico,
            'password' => Hash::make($request->password),
            'Tipo_Usuario' => $request->Tipo_Usuario,
        ]);

        return redirect()->route('admin.usuarios.index')->with('success', 'Usuario creado correctamente.');
    }

    public function edit(User $user)
    {
        return view('admin.usuarios.edit', compact('user'));
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required',
            'Correo_Electronico' => 'required|email|unique:users,Correo_Electronico,' . $user->id,
            'Tipo_Usuario' => 'required|in:admin,free,premium',
        ]);

        $user->update([
            'name' => $request->name,
            'Correo_Electronico' => $request->Correo_Electronico,
            'Tipo_Usuario' => $request->Tipo_Usuario,
        ]);

        return redirect()->route('admin.usuarios.index')->with('success', 'Usuario actualizado.');
    }

    public function destroy(User $user)
    {
        $user->delete();
        return redirect()->route('admin.usuarios.index')->with('success', 'Usuario eliminado.');
    }
}
