<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RopaController;
use App\Http\Controllers\AuthController;

Route::get('/', function () {
    return view('welcome');
});

// Login clásico
Route::get('/login', function () {
    return view('auth.login');
})->name('login');

Route::post('/login', [AuthController::class, 'login'])->name('auth.login');
Route::post('/logout', [AuthController::class, 'logout'])->name('auth.logout');

// Dashboard general
Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Rutas protegidas por autenticación
Route::middleware('auth')->group(function () {
    // Perfil
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Panel exclusivo para admin general
    Route::get('/admin', function () {
        return view('admin.dashboard'); // Debes tener esta vista
    })->middleware('tipo_usuario:admin')->name('admin.dashboard');

    // Vendedores: Free, Premium y Admin pueden vender ropa
    Route::middleware('tipo_usuario:free,premium,admin')->group(function () {
        Route::resource('ropas', RopaController::class);
    });
});

require __DIR__.'/auth.php';
