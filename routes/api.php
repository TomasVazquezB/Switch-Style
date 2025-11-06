<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RopaController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AccesorioController;
use App\Http\Controllers\ProductoController;
use Illuminate\Http\Request;

 ✅ ENDPOINTS PARA ANDROID (token-based)
 Route::prefix('mobile')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);  
});



// ---------------------------
// ✅ Rutas públicas
// ---------------------------
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/usuarios/{id}', [UserController::class, 'showPublic']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
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

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return response()->json($request->user());
});

Route::middleware(['cors'])->post('/crear-pedido', [PedidoController::class, 'store']);
