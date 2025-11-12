<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{
    RopaController,
    UserController,
    AuthController,
    AccesorioController,
    ProductoController,
    PedidoController
};
use Illuminate\Http\Request;

// ---------------------------
// ✅ RUTAS PARA ANDROID (token-based)
// ---------------------------
Route::prefix('mobile')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
});

// ---------------------------
// ✅ RUTAS PÚBLICAS (sin login)
// ---------------------------
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/usuarios/{id}', [UserController::class, 'showPublic']);

Route::get('/ropa', [RopaController::class, 'apiIndex']);
Route::get('/ropa/{id}', [RopaController::class, 'apiShow']);
Route::get('/accesorios', [AccesorioController::class, 'apiIndex']);
Route::get('/accesorios/{id}', [AccesorioController::class, 'apiShow']);
Route::apiResource('productos', ProductoController::class)->only(['index', 'show']);

// ---------------------------
// ✅ RUTAS PROTEGIDAS (auth:sanctum)
// ---------------------------
Route::middleware('auth:sanctum')->group(function () {
    // 🔒 Usuario autenticado
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/perfil', [UserController::class, 'perfil']);
    Route::get('/usuario', [UserController::class, 'index']);
    Route::get('/user', fn(Request $request) => response()->json($request->user()));

    // 🔒 Pedidos
    Route::post('/crear-pedido', [PedidoController::class, 'crear']);
    Route::get('/mis-pedidos', [PedidoController::class, 'misPedidos']);
});
