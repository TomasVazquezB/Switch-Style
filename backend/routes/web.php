<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RopaController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\TipoUsuario;

// 👉 Redirige la raíz al inicio autenticado
Route::get('/', function () {
    return redirect()->route('inicio');
});

// 👉 Página de bienvenida personalizada para todos los tipos de usuarios
Route::get('/inicio', function () {
    return view('inicio');
})->middleware('auth')->name('inicio');

// 👉 Rutas de autenticación
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);
});

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->middleware('auth')->name('logout');

// 👉 Página temporal de dashboard (ya no usada si usás /inicio)
Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware('auth')->name('dashboard');

// 👉 Rutas protegidas (requieren login)
Route::middleware('auth')->group(function () {

    // 🧍 Perfil del usuario
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // 👥 ABM de usuarios (solo admin)
    Route::middleware([TipoUsuario::class . ':admin'])->group(function () {
        Route::get('/admin/usuarios', [UserController::class, 'index'])->name('admin.usuarios.index');
        Route::get('/admin/usuarios/create', [UserController::class, 'create'])->name('admin.usuarios.create');
        Route::post('/admin/usuarios', [UserController::class, 'store'])->name('admin.usuarios.store');
        Route::get('/admin/usuarios/{user}/edit', [UserController::class, 'edit'])->name('admin.usuarios.edit');
        Route::put('/admin/usuarios/{user}', [UserController::class, 'update'])->name('admin.usuarios.update');
        Route::delete('/admin/usuarios/{user}', [UserController::class, 'destroy'])->name('admin.usuarios.destroy');
    });

    // 👚 Ropa (free, premium, admin)
    Route::middleware([TipoUsuario::class . ':free,premium,admin'])->group(function () {
        Route::resource('ropas', RopaController::class);
    });

    // 🔒 Ruta de prueba middleware
    Route::get('/test-middleware', function () {
        return '¡Middleware funcionando!';
    })->middleware([TipoUsuario::class . ':admin']);
});

// Archivos auth generados por Breeze o Jetstream
require __DIR__.'/auth.php';
