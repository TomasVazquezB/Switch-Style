<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Kreait\Firebase\Contract\Firestore;

class UserController extends Controller
{
    protected $firestore;

    public function __construct(Firestore $firestore)
    {
        $this->firestore = $firestore->database();
    }

    // 📋 Listar usuarios
    public function index()
    {
        $usuarios = User::orderBy('ID_Usuario','desc')->paginate(15); // con paginación
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
        $request->validate([
            'Nombre'             => 'required|string|max:255',
            'Correo_Electronico' => 'required|email|unique:usuario,Correo_Electronico',
            'Contraseña'         => 'required|string|min:8|confirmed',
            'Tipo_Usuario'       => 'required|in:admin,free,premium',
        ]);

        $user = User::create([
            'Nombre'             => $request->Nombre,
            'Correo_Electronico' => $request->Correo_Electronico,
            'Contraseña'         => Hash::make($request->Contraseña),
            'Tipo_Usuario'       => $request->Tipo_Usuario,
            'is_active'          => true,
        ]);

        // Guardar también en Firestore
        $this->firestore->collection('usuarios')->document((string)$user->ID_Usuario)->set([
            'uid'          => (string)$user->ID_Usuario,
            'nombre'       => $user->Nombre,
            'email'        => $user->Correo_Electronico,
            'tipo_usuario' => $user->Tipo_Usuario,
            'activo'       => $user->is_active,
        ]);

        return redirect()->route('admin.usuarios.index')->with('success', 'Usuario creado correctamente.');
    }

    // ✏️ Editar usuario
    public function edit(User $user)
    {
        return view('admin.usuarios.edit', compact('user'));
    }

    // 🔄 Actualizar usuario
    public function update(Request $request, User $user)
    {
        $request->validate([
            'Nombre'             => 'required|string|max:255',
            'Correo_Electronico' => 'required|email|unique:usuario,Correo_Electronico,' . $user->ID_Usuario . ',ID_Usuario',
            'Tipo_Usuario'       => 'required|in:admin,free,premium',
            'is_active'          => 'required|boolean',
        ]);

        $datos = [
            'Nombre'             => $request->Nombre,
            'Correo_Electronico' => $request->Correo_Electronico,
            'Tipo_Usuario'       => $request->Tipo_Usuario,
            'is_active'          => $request->is_active,
        ];

        // Solo actualiza contraseña si se envía
        if ($request->filled('Contraseña')) {
            $request->validate(['Contraseña' => 'string|min:8|confirmed']);
            $datos['Contraseña'] = Hash::make($request->Contraseña);
        }

        $user->update($datos);

        // Actualizar en Firestore
        $this->firestore->collection('usuarios')->document((string)$user->ID_Usuario)->set([
            'nombre'       => $user->Nombre,
            'email'        => $user->Correo_Electronico,
            'tipo_usuario' => $user->Tipo_Usuario,
            'activo'       => $user->is_active,
        ], ['merge' => true]);

        return redirect()->route('admin.usuarios.index')->with('success', 'Usuario actualizado.');
    }

    // 🗑️ Eliminar usuario
    public function destroy(User $user)
    {
        $user->delete();

        $this->firestore->collection('usuarios')->document((string)$user->ID_Usuario)->delete();

        return redirect()->route('admin.usuarios.index')->with('success', 'Usuario eliminado.');
    }

    // 🔀 Toggle estado activo/inactivo
    public function toggle(User $user)
    {
        $user->is_active = !$user->is_active;
        $user->save();

        // Actualizar en Firestore
        $this->firestore->collection('usuarios')->document((string)$user->ID_Usuario)->set([
            'activo' => $user->is_active,
        ], ['merge' => true]);

        return redirect()->route('admin.usuarios.index')
            ->with('success', 'El estado del usuario fue actualizado.');
    }

    // 👤 Perfil desde Firestore
    public function perfil(Request $request)
    {
        $uid = $request->get('firebase_uid');

        if (!$uid) {
            return response()->json(['error' => 'Token inválido o UID no presente'], 400);
        }

        $snapshot = $this->firestore->collection('usuarios')->document($uid)->snapshot();

        if (!$snapshot->exists()) {
            return response()->json(['error' => 'Usuario no encontrado en Firestore'], 404);
        }

        $data = $snapshot->data();

        return response()->json([
            'source'       => 'Firestore',
            'uid'          => $uid,
            'nombre'       => $data['nombre'] ?? null,
            'email'        => $data['email'] ?? null,
            'tipo_usuario' => $data['tipo_usuario'] ?? 'free',
            'activo'       => $data['activo'] ?? true,
            'message'      => 'Perfil obtenido con éxito',
        ]);
    }

    // 🔄 Crear usuario desde Firebase
    public function storeDesdeFirebase(Request $request)
    {
        $firebaseUid = $request->get('firebase_uid');
        $nombre = $request->get('name', 'Sin Nombre');
        $email = $request->get('email');

        if (!$firebaseUid) {
            return response()->json(['error' => 'UID Firebase requerido'], 400);
        }

        $existing = User::where('firebase_uid', $firebaseUid)->first();
        if ($existing) {
            return response()->json(['message' => 'El usuario ya existe en SQL']);
        }

        $user = User::create([
            'Nombre'             => $nombre,
            'Correo_Electronico' => $email,
            'Contraseña'         => Hash::make('firebase-default'),
            'Tipo_Usuario'       => 'free',
            'firebase_uid'       => $firebaseUid,
            'is_active'          => true,
        ]);

        $this->firestore->collection('usuarios')->document($firebaseUid)->set([
            'uid'          => $firebaseUid,
            'nombre'       => $nombre,
            'email'        => $email,
            'tipo_usuario' => 'free',
            'activo'       => true,
        ]);

        return response()->json(['message' => "Usuario sincronizado con UID: $firebaseUid"]);
    }
}
