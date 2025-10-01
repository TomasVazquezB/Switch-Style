<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RopaController;
use App\Http\Controllers\AccesorioController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ImagenAccesorioController;
use App\Http\Controllers\AuthController;
use App\Http\Middleware\TipoUsuario;

// Redirige a inicio
Route::get('/', fn() => redirect()->route('inicio'));

// Página de inicio (solo usuarios logueados y activos)
Route::get('/inicio', fn() => view('inicio'))
    ->middleware(['auth','active'])
    ->name('inicio');

// Rutas de login (solo guest)
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);
});

// API login para SPA / mobile
Route::post('/api/login', [AuthController::class, 'login']);

// Logout
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware(['auth','active'])
    ->name('logout');

// Dashboard
Route::get('/dashboard', fn() => view('dashboard'))
    ->middleware(['auth','active'])
    ->name('dashboard');

// Todas las rutas protegidas
Route::middleware(['auth','active'])->group(function () {

    // Perfil de usuario
    Route::prefix('perfil')->group(function () {
        Route::get('/', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::put('/', [ProfileController::class, 'update'])->name('profile.update');
        Route::put('/contraseña', [ProfileController::class, 'updatePassword'])->name('profile.password.update');
    });

    // 🔐 Solo Admins -> ABM Usuarios
    Route::middleware([TipoUsuario::class . ':admin'])
        ->prefix('admin/usuarios')
        ->name('admin.usuarios.')
        ->group(function () {
            Route::get('/', [UserController::class, 'index'])->name('index');
            Route::get('/create', [UserController::class, 'create'])->name('create');
            Route::post('/', [UserController::class, 'store'])->name('store');
            Route::get('/{user}/edit', [UserController::class, 'edit'])->name('edit');
            Route::put('/{user}', [UserController::class, 'update'])->name('update');
            Route::delete('/{user}', [UserController::class, 'destroy'])->name('destroy');
            Route::put('/{user}/toggle', [UserController::class, 'toggle'])->name('toggle');
        });

    // 👕 Ropas y Accesorios (free, premium, admin)
    Route::middleware([TipoUsuario::class . ':free,premium,admin'])->group(function () {
        Route::resource('ropas', RopaController::class);
        Route::resource('accesorios', AccesorioController::class);

        Route::delete('/imagenes/{imagen}', [ImagenAccesorioController::class, 'destroy'])->name('imagenes.destroy');
        Route::put('/imagenes/{imagen}/principal', [ImagenAccesorioController::class, 'marcarComoPrincipal'])->name('imagenes.principal');
    });
});

require __DIR__.'/auth.php';
