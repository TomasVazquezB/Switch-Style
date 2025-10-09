<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    // LISTAR
    public function index()
    {
        $usuarios = User::orderBy('ID_Usuario', 'asc')->get();
        return view('admin.usuarios.index', compact('usuarios'));
    }

    // FORM CREAR
    public function create()
    {
        return view('admin.usuarios.create');
    }

    // GUARDAR
    public function store(Request $request)
    {
        $data = $request->validate([
            'Nombre'             => ['required','string','max:255'],
            'Correo_Electronico' => ['required','email','max:255', Rule::unique('usuario','Correo_Electronico')],
            'Contraseña'         => ['required','string','min:6','confirmed'], // Contraseña + Contraseña_confirmation
            'Tipo_Usuario'       => ['required', Rule::in(['Admin','Free','Premium','admin','free','premium'])],
        ]);

        // Normalizar Tipo_Usuario y hashear contraseña
        $data['Tipo_Usuario'] = ucfirst(strtolower($data['Tipo_Usuario']));
        if (!empty($data['Contraseña']) && !str_starts_with($data['Contraseña'], '$2y$')) {
            $data['Contraseña'] = Hash::make($data['Contraseña']);
        }

        User::create([
            'Nombre'             => $data['Nombre'],
            'Correo_Electronico' => $data['Correo_Electronico'],
            'Contraseña'         => $data['Contraseña'],
            'Tipo_Usuario'       => $data['Tipo_Usuario'],
        ]);

        return redirect()->route('admin.usuarios.index')->with('success', 'Usuario creado correctamente.');
    }

    // FORM EDITAR
    public function edit(User $user)
    {
        return view('admin.usuarios.edit', compact('user'));
    }

    // ACTUALIZAR
    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'Nombre'             => ['required','string','max:255'],
            'Correo_Electronico' => [
                'required','email','max:255',
                Rule::unique('usuario','Correo_Electronico')->ignore($user->ID_Usuario, 'ID_Usuario'),
            ],
            'Tipo_Usuario'       => ['required', Rule::in(['Admin','Free','Premium','admin','free','premium'])],
            'Contraseña'         => ['nullable','string','min:6','confirmed'],
        ]);

        $payload = [
            'Nombre'             => $data['Nombre'],
            'Correo_Electronico' => $data['Correo_Electronico'],
            'Tipo_Usuario'       => ucfirst(strtolower($data['Tipo_Usuario'])),
        ];

        if (!empty($data['Contraseña'])) {
            $payload['Contraseña'] = str_starts_with($data['Contraseña'], '$2y$')
                ? $data['Contraseña']
                : Hash::make($data['Contraseña']);
        }

        $user->update($payload);

        return redirect()->route('admin.usuarios.index')->with('success', 'Usuario actualizado.');
    }

    // ELIMINAR
    public function destroy(User $user)
    {
        $user->delete();
        return redirect()->route('admin.usuarios.index')->with('success', 'Usuario eliminado.');
    }
}
