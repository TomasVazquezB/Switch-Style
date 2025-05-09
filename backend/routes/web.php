<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/api/prueba', function () {
    return response()->json(['mensaje' => '¡Conexión React-Laravel OK!']);
});
