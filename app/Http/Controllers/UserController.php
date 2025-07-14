<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserFirestore;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // 🟦 CRUD tradicional para el panel web
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

        // Además, crear en Firestore
        UserFirestore::create([
            'uid' => $user->id,
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

        // Actualizar en Firestore
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

    // 🟨 NUEVO: desde app móvil (Firebase)
    public function perfil(Request $request)
    {
        $firebaseUid = $request->get('firebase_uid');

        // Obtener datos desde Firestore (o SQL si sincronizaste antes)
        $doc = UserFirestore::findByUID($firebaseUid);

        if (!$doc || !$doc->snapshot()->exists()) {
            return response()->json(['error' => 'Usuario no encontrado'], 404);
        }

        $data = $doc->snapshot()->data();

        return response()->json([
            'uid' => $firebaseUid,
            'nombre' => $data['nombre'] ?? null,
            'email' => $data['email'] ?? null,
            'message' => 'Perfil obtenido con éxito'
        ]);
    }

    public function storeDesdeFirebase(Request $request)
    {
        $firebaseUid = $request->get('firebase_uid');
        $nombre = $request->get('name', 'Sin Nombre');
        $email = $request->get('email', null);

        // Verificar si ya existe en SQL
        $existing = User::where('firebase_uid', $firebaseUid)->first();
        if ($existing) {
            return response()->json(['message' => 'El usuario ya existe en SQL']);
        }

        // Crear en SQL
        $user = User::create([
            'name' => $nombre,
            'Correo_Electronico' => $email,
            'password' => Hash::make('firebase-default'), // opcional
            'Tipo_Usuario' => 'free',
            'firebase_uid' => $firebaseUid,
        ]);

        // Crear en Firestore
        UserFirestore::create([
            'uid' => $firebaseUid,
            'nombre' => $nombre,
            'email' => $email,
        ]);

        return response()->json(['message' => "Usuario sincronizado con UID: $firebaseUid"]);
    }
}
