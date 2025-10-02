<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    // 📋 Listar usuarios
    public function index()
    {
        $usuarios = User::orderBy('ID_Usuario', 'desc')->paginate(15);
        return view('admin.usuarios.index', compact('usuarios'));
    }

    // ➕ Formulario crear
    public function create()
    {
        return view('admin.usuarios.create');
    }

    // 💾 Guardar nuevo usuario
    public function store(Request $request)
    {
        $validated = $request->validate([
            'Nombre'             => 'required|string|max:255',
            'Correo_Electronico' => 'required|email|unique:usuario,Correo_Electronico',
            'Contraseña'         => 'required|string|min:8|confirmed',
            'Tipo_Usuario'       => 'required|in:admin,free,premium',
            'is_active'          => 'nullable|boolean',
        ]);

        // Gracias al mutator del modelo, NO hasheamos acá.
        User::create([
            'Nombre'             => $validated['Nombre'],
            'Correo_Electronico' => $validated['Correo_Electronico'],
            'Contraseña'         => $validated['Contraseña'], // el mutator hace el hash
            'Tipo_Usuario'       => $validated['Tipo_Usuario'],
            'is_active'          => $request->boolean('is_active', true),
        ]);

        return redirect()
            ->route('usuarios.index')
            ->with('success', 'Usuario creado correctamente.');
    }

    // ✏️ Editar usuario
    public function edit(User $user)
    {
        return view('admin.usuarios.edit', compact('user'));
    }

    // 🔄 Actualizar usuario
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'Nombre'             => 'required|string|max:255',
            'Correo_Electronico' => 'required|email|unique:usuario,Correo_Electronico,' . $user->ID_Usuario . ',ID_Usuario',
            'Tipo_Usuario'       => 'required|in:admin,free,premium',
            'is_active'          => 'nullable|boolean',
            'Contraseña'         => 'nullable|string|min:8|confirmed',
        ]);

        $datos = [
            'Nombre'             => $validated['Nombre'],
            'Correo_Electronico' => $validated['Correo_Electronico'],
            'Tipo_Usuario'       => $validated['Tipo_Usuario'],
            // si el checkbox no viene, mantenemos el valor actual:
            'is_active'          => $request->has('is_active') ? $request->boolean('is_active') : (bool) $user->is_active,
        ];

        if (!empty($validated['Contraseña'])) {
            $datos['Contraseña'] = $validated['Contraseña']; // mutator hashea
        }

        $user->update($datos);

        return redirect()
            ->route('usuarios.index')
            ->with('success', 'Usuario actualizado.');
    }

    // 🗑️ Eliminar usuario
    public function destroy(User $user)
    {
        $user->delete();

        return redirect()
            ->route('usuarios.index')
            ->with('success', 'Usuario eliminado.');
    }

    // 🔀 Activar / Desactivar
    public function toggle(User $user)
    {
        $user->is_active = ! (bool) $user->is_active;
        $user->save();

        return redirect()
            ->route('usuarios.index')
            ->with('success', 'El estado del usuario fue actualizado.');
    }
}
