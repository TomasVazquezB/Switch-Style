<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RopaController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AccesorioController;
use App\Http\Controllers\CarritoController;
use App\Http\Controllers\FirebaseController;
use App\Http\Controllers\ProductoController;
use Kreait\Firebase\Auth; 

Route::get('/test', fn () => response()->json(['message' => 'API funcionando correctamente']));
Route::get('/ping', fn() => response()->json(['message' => 'pong']));

Route::get('/firebase/list-auth-users', [FirebaseController::class, 'listAuthUsers']);

Route::get('/firebase/get-users', [FirebaseController::class, 'getUsers']);

Route::get('/firebase-test', function () {
    try {
        $auth = app(Auth::class);
        $users = $auth->listUsers(5);

        $uids = [];
        foreach ($users as $user) {
            $uids[] = $user->uid;
        }

        return response()->json([
            'message' => 'Conexión a Firebase exitosa',
            'usuarios_encontrados' => $uids,
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Error conectando con Firebase',
            'mensaje' => $e->getMessage(),
        ], 500);
    }
});

Route::get('/ropa', [RopaController::class, 'apiIndex']);
Route::get('/ropa/{id}', [RopaController::class, 'apiShow']);

Route::get('/usuario', [UserController::class, 'index']);


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
Route::middleware('auth:sanctum')->get('/user', fn () => auth()->user());

Route::get('/accesorios', [AccesorioController::class, 'apiIndex']);
Route::get('/accesorios/{id}', [AccesorioController::class, 'apiShow']);

Route::post('/firebase/add-user', [FirebaseController::class, 'addUser']);
Route::get('/firebase/get-users', [FirebaseController::class, 'getUsers']);
Route::apiResource('productos', ProductoController::class);

Route::middleware('firebase.auth')->group(function () {
    Route::get('/perfil', [UserController::class, 'perfil']);
    Route::post('/usuarios/firebase', [UserController::class, 'storeDesdeFirebase']);
    Route::get('/firebase/test', [FirebaseController::class, 'testConnection']);

});
