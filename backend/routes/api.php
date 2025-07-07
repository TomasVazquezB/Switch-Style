<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RopaController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AccesorioController;
use App\Http\Controllers\CarritoController;
use App\Http\Controllers\FirebaseController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\API\FavoritoController;

/*
|--------------------------------------------------------------------------
| Rutas públicas
|--------------------------------------------------------------------------
*/

// Test
Route::get('/test', fn () => response()->json(['message' => 'API funcionando correctamente']));

// Ropa
Route::get('/ropa', [RopaController::class, 'apiIndex']);
Route::get('/ropa/{id}', [RopaController::class, 'apiShow']);
Route::get('/ropa/buscar', [RopaController::class, 'buscar']);

// Accesorios
Route::get('/accesorios', [AccesorioController::class, 'apiIndex']);
Route::get('/accesorios/{id}', [AccesorioController::class, 'apiShow']);

// Productos generales
Route::get('/producto/buscar', [ProductoController::class, 'buscar']);

// Firebase (test / desarrollo)
Route::post('/firebase/add-user', [FirebaseController::class, 'addUser']);
Route::get('/firebase/get-users', [FirebaseController::class, 'getUsers']);

// Usuarios
Route::get('/usuario', [UserController::class, 'index']);

/*
|--------------------------------------------------------------------------
| Autenticación
|--------------------------------------------------------------------------
*/

// Registro y login públicos
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Requiere sesión con Sanctum
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', fn () => auth()->user());

    // Favoritos
    Route::get('/favoritos', [FavoritoController::class, 'index']);
    Route::post('/favoritos', [FavoritoController::class, 'store']);
    Route::delete('/favoritos/{id}', [FavoritoController::class, 'destroy']);
});
