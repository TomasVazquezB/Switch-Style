<?php

namespace App\Http\Controllers;

use App\Services\FirebaseService;
use Illuminate\Http\Request;

class FirebaseController extends Controller
{
    protected $firestore;
    protected $auth;
    protected $collectionName = 'user';  

    public function __construct(FirebaseService $firebaseService)
    {
        $this->firestore = $firebaseService->getFirestore();
        $this->auth = $firebaseService->getAuth();
    }

    public function addUser(Request $request)
    {
        $validated = $request->validate(['name' => 'required|string|max:255','email' => 'required|email','password' => 'required|min:6',]);

        try {
            $user = $this->auth->createUser(['email' => $validated['email'],'password' => $validated['password'],'displayName' => $validated['name'],]);

            if (empty($user->uid)) {
                return response()->json(['error' => 'No se pudo obtener el UID del usuario'], 500);
            }
            $uid = $user->uid;

            $this->firestore->collection($this->collectionName)->document($uid)->set(['name' => $validated['name'],'email' => $validated['email'],'created_at' => now()->toDateTimeString(),]);

            return response()->json(['message' => 'User added successfully', 'uid' => $uid]);

        } catch (\Throwable $e) {
            return response()->json(['error' => 'Error adding user','message' => $e->getMessage()], 500);
        }
    }

    public function getUsers()
    {
        try {
            $documents = $this->firestore->collection($this->collectionName)->documents();
            $users = [];

            foreach ($documents as $doc) {
                if ($doc->exists()) {$data = $doc->data();$data['id'] = $doc->id();$users[] = $data;}
            }

            return response()->json(['message' => 'Usuarios de Firestore obtenidos','users' => $users,]);

        } catch (\Throwable $e) {
            return response()->json(['error' => 'Error fetching users','message' => $e->getMessage()], 500);
        }
    }

    public function listAuthUsers()
    {
        try {
            $users = [];
            $pageToken = null;

            do {
                $page = $this->auth->listUsers(1000, $pageToken);

                foreach ($page as $user) {
                    $users[] = ['uid' => $user->uid,'email' => $user->email,'displayName' => $user->displayName,];
                }

                $pageToken = $page->nextPageToken();

            } while ($pageToken !== null);

            return response()->json(['message' => 'Usuarios de Firebase Auth obtenidos','users' => $users,]);
        } catch (\Throwable $e) {
            return response()->json(['error' => 'Error al obtener usuarios de Firebase Auth','message' => $e->getMessage(),], 500);
        }
    }

    public function testConnection()
    {
        try {
            $email = 'email-que-existe@tu-dominio.com'; 
            $user = $this->auth->getUserByEmail($email);

            return response()->json(['message' => 'Conexión a Firebase exitosa','uid' => $user->uid,'email' => $user->email,'name' => $user->displayName,]);

        } catch (\Throwable $e) {
            return response()->json(['error' => 'Error conectando a Firebase','message' => $e->getMessage()], 500);
        }
    }
}