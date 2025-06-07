<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RopaController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/api/prueba', function () {
    return response()->json(['mensaje' => '¡Conexión React-Laravel OK!']);
});

Route::resource('ropas', RopaController::class);
