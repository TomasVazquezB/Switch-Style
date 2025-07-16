<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Services\FirestoreService;

class UserController extends Controller
{
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

        // Firestore opcional: sincronizar
        $firestore = new FirestoreService();
        $firestore->collection('usuarios')->document((string)$user->id)->set([
            'uid' => (string)$user->id,
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

        $user->update([
            'name' => $request->name,
            'Correo_Electronico' => $request->Correo_Electronico,
            'Tipo_Usuario' => $request->Tipo_Usuario,
        ]);

        // Firestore update
        $firestore = new FirestoreService();
        $doc = $firestore->collection('usuarios')->document((string)$user->id);
        $doc->set([
            'nombre' => $user->name,
            'email' => $user->Correo_Electronico,
        ], ['merge' => true]);

        return redirect()->route('admin.usuarios.index')->with('success', 'Usuario actualizado.');
    }

    public function destroy(User $user)
    {
        $user->delete();

        $firestore = new FirestoreService();
        $doc = $firestore->collection('usuarios')->document((string)$user->id);
        $doc->delete();

        return redirect()->route('admin.usuarios.index')->with('success', 'Usuario eliminado.');
    }

    // 🔶 Perfil desde Firebase
    public function perfil(Request $request)
    {
        $firebaseUid = $request->get('firebase_uid');

        if (!$firebaseUid) {
            return response()->json(['error' => 'Token Firebase inválido o no presente'], 400);
        }

        $firestore = new FirestoreService();
        $doc = $firestore->collection('usuarios')->document($firebaseUid)->snapshot();

        if (!$doc->exists()) {
            return response()->json(['error' => 'Usuario no encontrado en Firestore'], 404);
        }

        return response()->json([
            'uid' => $firebaseUid,
            'nombre' => $doc->data()['nombre'] ?? null,
            'email' => $doc->data()['email'] ?? null,
            'message' => 'Perfil obtenido con éxito'
        ]);
    }

    // 🟨 Crear usuario desde App Móvil
    public function storeDesdeFirebase(Request $request)
    {
        $firebaseUid = $request->get('firebase_uid');
        $nombre = $request->get('name', 'Sin Nombre');
        $email = $request->get('email', null);

        if (!$firebaseUid) {
            return response()->json(['error' => 'UID Firebase requerido'], 400);
        }

        // Verificar si ya existe en SQL
        $existing = User::where('firebase_uid', $firebaseUid)->first();
        if ($existing) {
            return response()->json(['message' => 'El usuario ya existe en SQL']);
        }

        // Crear en SQL
        $user = User::create([
            'name' => $nombre,
            'Correo_Electronico' => $email,
            'password' => Hash::make('firebase-default'),
            'Tipo_Usuario' => 'free',
            'firebase_uid' => $firebaseUid,
        ]);

        // Crear en Firestore
        $firestore = new FirestoreService();
        $firestore->collection('usuarios')->document($firebaseUid)->set([
            'uid' => $firebaseUid,
            'nombre' => $nombre,
            'email' => $email,
        ]);

        return response()->json(['message' => "Usuario sincronizado con UID: $firebaseUid"]);
    }
}
