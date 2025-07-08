<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RopaController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AccesorioController;
use App\Http\Controllers\CarritoController;
use App\Http\Controllers\FirebaseController;

Route::post('/firebase/add-user', [FirebaseController::class, 'addUser']);
Route::get('/firebase/get-users', [FirebaseController::class, 'getUsers']);

// Test
Route::get('/test', fn () => response()->json(['message' => 'API funcionando correctamente']));

// Ropa
Route::get('/ropa', [RopaController::class, 'apiIndex']);
Route::get('/ropa/{id}', [RopaController::class, 'apiShow']);

// Usuarios
Route::get('/usuario', [UserController::class, 'index']);

// Auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
Route::middleware('auth:sanctum')->get('/user', fn () => auth()->user());

// Accesorios
Route::get('/accesorios', [AccesorioController::class, 'apiIndex']);
Route::get('/accesorios/{id}', [AccesorioController::class, 'apiShow']);
