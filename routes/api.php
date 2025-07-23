<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\RopaController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AccesorioController;
use App\Http\Controllers\FirebaseController;
use App\Http\Controllers\ProductoController;

// 🔹 Test y Diagnóstico
Route::get('/test', fn () => response()->json(['message' => 'API funcionando correctamente']));

// 🔹 Firebase SDK Test
Route::get('/firebase/list-auth-users', [FirebaseController::class, 'listAuthUsers']);
Route::get('/firebase/get-users', [FirebaseController::class, 'getUsers']);
Route::get('/firebase/test', [FirebaseController::class, 'testConnection']);

// 🔹 Diagnóstico: conexión Firestore
Route::get('/firebase/check', function () {
    $firestore = app('firebase.firestore')->database();
    $firestore->collection('usuarios')->document('test-check')->set(['nombre' => 'Prueba Check','email' => 'check@example.com',
    ]);
    return '✅ Firestore conectado correctamente.';
});

// 🔹 Productos
Route::apiResource('productos', ProductoController::class);

// 🔹 Ropa
Route::get('/ropa', [RopaController::class, 'apiIndex']);
Route::get('/ropa/{id}', [RopaController::class, 'apiShow']);

// 🔹 Accesorios
Route::get('/accesorios', [AccesorioController::class, 'apiIndex']);
Route::get('/accesorios/{id}', [AccesorioController::class, 'apiShow']);

// 🔹 Usuarios (SQL, Web Admin)
Route::get('/usuario', [UserController::class, 'index']);

// 🔹 Registro/Login desde App
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// 🔐 Protegido por Firebase Bearer Token Middleware
Route::middleware('firebase')->group(function () {
    Route::post('/logout', fn () => response()->json(['message' => 'Logout correcto']));
    
    Route::get('/user', function (Request $request) {
        $uid = $request->get('firebase_uid');
        if (!$uid) return response()->json(['error' => 'UID Firebase no presente'], 400);

        $firestore = app('firebase.firestore')->database();
        $doc = $firestore->collection('usuarios')->document($uid)->snapshot();

        if (!$doc->exists()) {
            return response()->json(['error' => 'Usuario no encontrado en Firestore'], 404);
        }

        return response()->json(['uid' => $uid,'nombre' => $doc->data()['nombre'] ?? null,'email' => $doc->data()['email'] ?? null,'tipo_usuario' => $doc->data()['tipo_usuario'] ?? 'free',]);
    });

    Route::get('/perfil', [UserController::class, 'perfil']);
    Route::post('/usuarios/firebase', [UserController::class, 'storeDesdeFirebase']);
});

// 🔹 Crear usuarios manualmente desde Laravel
Route::post('/firebase/add-user', [FirebaseController::class, 'addUser']);
