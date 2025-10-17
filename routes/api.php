<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RopaController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AccesorioController;
use App\Http\Controllers\ProductoController;

// ---------------------------
// ✅ Rutas públicas
// ---------------------------
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Productos principales
Route::get('/ropa', [RopaController::class, 'apiIndex']);
Route::get('/ropa/{id}', [RopaController::class, 'apiShow']);

Route::get('/accesorios', [AccesorioController::class, 'apiIndex']);
Route::get('/accesorios/{id}', [AccesorioController::class, 'apiShow']);

Route::apiResource('productos', ProductoController::class)->only(['index', 'show']);

// ---------------------------
// ✅ Rutas protegidas (usuarios logueados)
// ---------------------------
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/perfil', [UserController::class, 'perfil']);
    Route::get('/usuario', [UserController::class, 'index']);
});
