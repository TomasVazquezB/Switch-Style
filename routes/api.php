<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\RopaController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AccesorioController;
use App\Http\Controllers\ProductoController;

// Productos
Route::apiResource('productos', ProductoController::class);

// Ropa
Route::get('/ropa', [RopaController::class, 'apiIndex']);
Route::get('/ropa/{id}', [RopaController::class, 'apiShow']);

// Accesorios
Route::get('/accesorios', [AccesorioController::class, 'apiIndex']);
Route::get('/accesorios/{id}', [AccesorioController::class, 'apiShow']);

// Usuarios
Route::get('/usuario', [UserController::class, 'index']);

// Auth (registro / login / logout)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);

// Perfil del usuario autenticado
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/perfil', [UserController::class, 'perfil']);
});
