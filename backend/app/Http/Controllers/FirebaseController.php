<?php

namespace App\Http\Controllers;

use App\Services\FirebaseService;
use Illuminate\Http\Request;

class FirebaseController extends Controller
{
    protected $firestore;
    protected $auth;

    public function __construct(FirebaseService $firebaseService)
    {
        $this->firestore = $firebaseService->getFirestore();
        $this->auth = $firebaseService->getAuth();
    }

    public function addUser(Request $request)
    {
        // Validar los datos recibidos
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
        ]);

        try {
            // Crear un nuevo usuario en Firebase Auth
            $user = $this->auth->createUser([
                'email' => $validated['email'],
                'password' => $validated['password'],
                'displayName' => $validated['name'],
            ]);

            // Guardar datos adicionales en Firestore
            $this->firestore->collection('users')->document($user->uid)->set([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'created_at' => now(),
            ]);

            return response()->json(['message' => 'User added successfully', 'uid' => $user->uid]);
        } catch (\Throwable $e) {
            return response()->json(['error' => 'Error adding user', 'message' => $e->getMessage()], 500);
        }
    }

    public function getUsers()
    {
        try {
            $documents = $this->firestore->collection('users')->documents();
            $users = [];

            foreach ($documents as $doc) {
                $users[] = $doc->data();
            }

            return response()->json($users);
        } catch (\Throwable $e) {
            return response()->json(['error' => 'Error fetching users', 'message' => $e->getMessage()], 500);
        }
    }
}
