<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RopaController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AccesorioController;
use App\Http\Controllers\ProductoController;

// ---------------------------
// ✅ Login y Registro (no protegidos)
// ---------------------------
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// ---------------------------
// ✅ Endpoints públicos
// ---------------------------
Route::get('/ropa', [RopaController::class, 'apiIndex']);
Route::get('/ropa/{id}', [RopaController::class, 'apiShow']);
Route::get('/accesorios', [AccesorioController::class, 'apiIndex']);
Route::get('/accesorios/{id}', [AccesorioController::class, 'apiShow']);
Route::apiResource('productos', ProductoController::class)->only(['index', 'show']);

// ---------------------------
// ✅ Rutas protegidas (requieren token Sanctum)
// ---------------------------
Route::middleware('auth:sanctum')->group(function () {

    // Logout
    Route::post('/logout', [AuthController::class, 'logout']);

    // Perfil del usuario autenticado
    Route::get('/perfil', [UserController::class, 'perfil']);

    // Listado de usuarios (solo admin si querés)
    Route::get('/usuario', [UserController::class, 'index']);

    // Ejemplo: creación/edición de productos solo para usuarios autenticados
    // Route::post('/productos', [ProductoController::class, 'store']);
    // Route::put('/productos/{id}', [ProductoController::class, 'update']);
});
