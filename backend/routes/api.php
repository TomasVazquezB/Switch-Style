<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RopaControllerApi;
use App\Http\Controllers\RopaController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;

Route::get('/test', fn () => response()->json(['message' => 'API funcionando correctamente']));

// ✅ API PARA REACT
Route::get('/ropa', [RopaController::class, 'apiIndex']);
Route::get('/ropa/{id}', [RopaController::class, 'apiShow']);

// ✅ API DE USUARIOS
Route::get('/usuario', [UserController::class, 'index']);

// ✅ AUTH
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->get('/user', fn () => auth()->user());
