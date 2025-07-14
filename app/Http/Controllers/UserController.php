<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserFirestore;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // Métodos para manejar usuarios en base SQL tradicional (Eloquent)
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
        // Validación para SQL
        $request->validate([
            'name' => 'required',
            'Correo_Electronico' => 'required|email|unique:users',
            'password' => 'required|confirmed',
            'Tipo_Usuario' => 'required|in:admin,free,premium',
        ]);

        // Crear en SQL
        $user = User::create([
            'name' => $request->name,
            'Correo_Electronico' => $request->Correo_Electronico,
            'password' => Hash::make($request->password),
            'Tipo_Usuario' => $request->Tipo_Usuario,
        ]);

        // Además, crear en Firestore usando UserFirestore
        UserFirestore::create([
            'uid' => $user->id, // o usa otro UID único (podés ajustar)
            'nombre' => $user->name,
            'email' => $user->Correo_Electronico,
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

        // Actualizar SQL
        $user->update([
            'name' => $request->name,
            'Correo_Electronico' => $request->Correo_Electronico,
            'Tipo_Usuario' => $request->Tipo_Usuario,
        ]);

        // Actualizar Firestore: buscá el documento y actualizalo (simple ejemplo)
        $doc = UserFirestore::findByUID($user->id);
        if ($doc) {
            $doc->reference()->update([
                'nombre' => $user->name,
                'email' => $user->Correo_Electronico,
            ]);
        }

        return redirect()->route('admin.usuarios.index')->with('success', 'Usuario actualizado.');
    }

    public function destroy(User $user)
    {
        // Borrar en SQL
        $user->delete();

        // Borrar en Firestore
        $doc = UserFirestore::findByUID($user->id);
        if ($doc) {
            $doc->reference()->delete();
        }

        return redirect()->route('admin.usuarios.index')->with('success', 'Usuario eliminado.');
    }
}
