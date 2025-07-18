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

    // 🔵 CRUD Web (Admin)
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

        $user = User::create([
            'name' => $request->name,
            'Correo_Electronico' => $request->Correo_Electronico,
            'password' => Hash::make($request->password),
            'Tipo_Usuario' => $request->Tipo_Usuario,
        ]);

        $this->firestore->collection('usuarios')->document((string)$user->id)->set([
            'uid' => (string)$user->id,
            'nombre' => $user->name,
            'email' => $user->Correo_Electronico,
            'tipo_usuario' => $user->Tipo_Usuario
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

        $this->firestore->collection('usuarios')->document((string)$user->id)->set([
            'nombre' => $user->name,
            'email' => $user->Correo_Electronico,
            'tipo_usuario' => $user->Tipo_Usuario
        ], ['merge' => true]);

        return redirect()->route('admin.usuarios.index')->with('success', 'Usuario actualizado.');
    }

    public function destroy(User $user)
    {
        $user->delete();

        $this->firestore->collection('usuarios')->document((string)$user->id)->delete();

        return redirect()->route('admin.usuarios.index')->with('success', 'Usuario eliminado.');
    }

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
            'uid' => $uid,
            'nombre' => $data['nombre'] ?? null,
            'email' => $data['email'] ?? null,
            'tipo_usuario' => $data['tipo_usuario'] ?? 'free',
            'message' => 'Perfil obtenido con éxito'
        ]);
    }

    public function storeDesdeFirebase(Request $request)
    {
        $firebaseUid = $request->get('firebase_uid');
        $nombre = $request->get('name', 'Sin Nombre');
        $email = $request->get('email', null);

        if (!$firebaseUid) {
            return response()->json(['error' => 'UID Firebase requerido'], 400);
        }

        $existing = User::where('firebase_uid', $firebaseUid)->first();
        if ($existing) {
            return response()->json(['message' => 'El usuario ya existe en SQL']);
        }

        $user = User::create([
            'name' => $nombre,
            'Correo_Electronico' => $email,
            'password' => Hash::make('firebase-default'),
            'Tipo_Usuario' => 'free',
            'firebase_uid' => $firebaseUid,
        ]);

        $this->firestore->collection('usuarios')->document($firebaseUid)->set([
            'uid' => $firebaseUid,
            'nombre' => $nombre,
            'email' => $email,
            'tipo_usuario' => 'free'
        ]);

        return response()->json(['message' => "Usuario sincronizado con UID: $firebaseUid"]);
    }
}
