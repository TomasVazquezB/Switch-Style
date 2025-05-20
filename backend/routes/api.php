<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\AuthController;

Route::get('/producto', [ProductoController::class, 'index']);
Route::get('/test', function () {
    return response()->json(['message' => 'API funcionando correctamente']);
});

Route::post('/producto', [ProductoController::class, 'store']);

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->get('/user', function () {
    return auth()->user();
});
