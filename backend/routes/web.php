<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RopaController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ImagenController;
use App\Http\Middleware\TipoUsuario;

// 👉 Redirige la raíz a /inicio
Route::get('/', fn() => redirect()->route('inicio'));

// 👉 Página de inicio para usuarios autenticados
Route::get('/inicio', fn() => view('inicio'))->middleware('auth')->name('inicio');

// 👉 Rutas de autenticación
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);
});

// 👉 Logout
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->middleware('auth')->name('logout');

// 👉 Dashboard opcional
Route::get('/dashboard', fn() => view('dashboard'))->middleware('auth')->name('dashboard');

// 👉 Rutas protegidas
Route::middleware('auth')->group(function () {

    // Perfil del usuario
    Route::prefix('perfil')->group(function () {
        Route::get('/', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::put('/', [ProfileController::class, 'update'])->name('profile.update');
        Route::put('/contraseña', [ProfileController::class, 'updatePassword'])->name('profile.password.update');
    });

    // Administración de usuarios (solo admin)
    Route::middleware([TipoUsuario::class . ':admin'])->prefix('admin/usuarios')->name('admin.usuarios.')->group(function () {
        Route::get('/', [UserController::class, 'index'])->name('index');
        Route::get('/create', [UserController::class, 'create'])->name('create');
        Route::post('/', [UserController::class, 'store'])->name('store');
        Route::get('/{user}/edit', [UserController::class, 'edit'])->name('edit');
        Route::put('/{user}', [UserController::class, 'update'])->name('update');
        Route::delete('/{user}', [UserController::class, 'destroy'])->name('destroy');
    });

    // CRUD de prendas y gestión de imágenes
    Route::middleware([TipoUsuario::class . ':free,premium,admin'])->group(function () {
        Route::resource('ropas', RopaController::class);

        // Eliminar una imagen individual
        Route::delete('/imagenes/{imagen}', [ImagenController::class, 'destroy'])->name('imagenes.destroy');

        // Marcar imagen como principal
        Route::put('/imagenes/{imagen}/principal', [ImagenController::class, 'setAsPrincipal'])->name('imagenes.principal');
    });
});

require __DIR__.'/auth.php';
