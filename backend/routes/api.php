<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\RopaController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AccesorioController;
use App\Http\Controllers\FirebaseController;
use App\Http\Controllers\ProductoController;
use App\Services\FirebaseService;

Route::get('/firebase/list-auth-users', [FirebaseController::class, 'listAuthUsers']);
Route::get('/firebase/get-users', [FirebaseController::class, 'getUsers']);
Route::get('/firebase/test', [FirebaseController::class, 'testConnection']);

Route::get('/firebase/check', function (FirebaseService $firebaseService) {
    try {
        $firestore = $firebaseService->getFirestore();
        $firestore->collection('usuarios')->document('test-check')->set(['nombre' => 'Prueba Check', 'email' => 'check@example.com','timestamp' => now()->toDateTimeString(),]);
        $auth = $firebaseService->getAuth();
        $users = $auth->listUsers(1);
        $count = iterator_count($users);

        return response()->json(['message' => '✅ Firebase conectado correctamente','firestore_test_document' => 'test-check','firebase_auth_sample_users_count' => $count,]);
    } catch (\Throwable $e) {
        return response()->json(['error' => 'Error conectando a Firebase','message' => $e->getMessage(),'trace' => $e->getTraceAsString(),], 500);
    }
});

Route::apiResource('productos', ProductoController::class);

Route::get('/ropa', [RopaController::class, 'apiIndex']);
Route::get('/ropa/{id}', [RopaController::class, 'apiShow']);

Route::get('/accesorios', [AccesorioController::class, 'apiIndex']);
Route::get('/accesorios/{id}', [AccesorioController::class, 'apiShow']);

Route::get('/usuario', [UserController::class, 'index']);

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('firebase')->group(function () {
    Route::post('/logout', fn () => response()->json(['message' => 'Logout correcto']));
    
    Route::get('/user', function (Request $request, FirebaseService $firebaseService) {
        $uid = $request->get('firebase_uid');
        if (!$uid) return response()->json(['error' => 'UID Firebase no presente'], 400);

        $firestore = $firebaseService->getFirestore();
        $doc = $firestore->collection('usuarios')->document($uid)->snapshot();

        if (!$doc->exists()) {
            return response()->json(['error' => 'Usuario no encontrado en Firestore'], 404);
        }

        return response()->json(['uid' => $uid,'nombre' => $doc->data()['nombre'] ?? null,'email' => $doc->data()['email'] ?? null,'tipo_usuario' => $doc->data()['tipo_usuario'] ?? 'free',]);
    });

    Route::get('/perfil', [UserController::class, 'perfil']);
    Route::post('/usuarios/firebase', [UserController::class, 'storeDesdeFirebase']);
});

Route::post('/firebase/add-user', [FirebaseController::class, 'addUser']);