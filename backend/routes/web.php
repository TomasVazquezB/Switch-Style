<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RopaController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\TipoUsuario;

// 👉 Redirige la raíz a /inicio
Route::get('/', function () {
    return redirect()->route('inicio');
});

// 👉 Página de inicio personalizada para usuarios autenticados
Route::get('/inicio', function () {
    return view('inicio');
})->middleware('auth')->name('inicio');

// 👉 Rutas de autenticación
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);
});

// 👉 Cierre de sesión
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth')
    ->name('logout');

// 👉 Dashboard (opcional o legacy)
Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware('auth')->name('dashboard');

// 👉 Rutas protegidas por autenticación
Route::middleware('auth')->group(function () {

    // 🧍 Perfil del usuario
    Route::prefix('perfil')->group(function () {
        Route::get('/', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::put('/', [ProfileController::class, 'update'])->name('profile.update');
        Route::put('/contraseña', [ProfileController::class, 'updatePassword'])->name('profile.password.update');
    });

    // 👥 ABM de usuarios (solo para admins)
    Route::middleware([TipoUsuario::class . ':admin'])->prefix('admin/usuarios')->name('admin.usuarios.')->group(function () {
        Route::get('/', [UserController::class, 'index'])->name('index');
        Route::get('/create', [UserController::class, 'create'])->name('create');
        Route::post('/', [UserController::class, 'store'])->name('store');
        Route::get('/{user}/edit', [UserController::class, 'edit'])->name('edit');
        Route::put('/{user}', [UserController::class, 'update'])->name('update');
        Route::delete('/{user}', [UserController::class, 'destroy'])->name('destroy');
    });

    // 👚 CRUD de prendas para todos los tipos de usuario válidos
    Route::middleware([TipoUsuario::class . ':free,premium,admin'])->group(function () {
        Route::resource('ropas', RopaController::class);
    });
});

// 👉 Archivos de autenticación generados por Breeze o Jetstream
require __DIR__.'/auth.php';
