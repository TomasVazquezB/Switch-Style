<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductoController;

Route::get('/producto', [ProductoController::class, 'index']);
Route::get('/test', function () {
    return response()->json(['message' => 'API funcionando correctamente']);
});

Route::post('/producto', [ProductoController::class, 'store']);
