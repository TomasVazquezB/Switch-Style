<?php

namespace App\Http\Controllers;

use App\Services\FirebaseService;
use Illuminate\Http\Request;

class FirebaseController extends Controller
{
    protected $firestore;
    protected $auth;

    /**
     * Inyecta el servicio FirebaseService
     */
    public function __construct(FirebaseService $firebaseService)
    {
        $this->firestore = $firebaseService->getFirestore();
        $this->auth = $firebaseService->getAuth();
    }

    /**
     * Crea un usuario en Firebase Auth y lo guarda en Firestore
     */
    public function addUser(Request $request)
    {
        // Validación básica, sin 'unique' en SQL porque estamos con Firestore
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'password' => 'required|min:6',
        ]);

        try {
            // Crear usuario en Firebase Authentication
            $user = $this->auth->createUser([
                'email' => $validated['email'],
                'password' => $validated['password'],
                'displayName' => $validated['name'],
            ]);

            // Obtener UID directamente (es propiedad, no método)
            if (empty($user->uid)) {
                return response()->json(['error' => 'No se pudo obtener el UID del usuario'], 500);
            }
            $uid = $user->uid;

            // Guardar datos adicionales en Firestore, colección 'users', documento con uid de Firebase Auth
            $this->firestore->collection('users')->document($uid)->set([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'created_at' => now()->toDateTimeString(),
            ]);

            return response()->json(['message' => 'User added successfully', 'uid' => $uid]);

        } catch (\Throwable $e) {
            // Devolver error en caso de fallo
            return response()->json([
                'error' => 'Error adding user',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtiene todos los usuarios guardados en Firestore en la colección 'users'
     */
    public function getUsers()
    {
        try {
            $documents = $this->firestore->collection('users')->documents();
            $users = [];

            foreach ($documents as $doc) {
                if ($doc->exists()) {
                    $data = $doc->data();
                    $data['id'] = $doc->id();
                    $users[] = $data;
                }
            }

            return response()->json($users);

        } catch (\Throwable $e) {
            return response()->json([
                'error' => 'Error fetching users',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
