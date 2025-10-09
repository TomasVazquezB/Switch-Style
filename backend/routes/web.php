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

// Home -> /inicio
Route::get('/', fn() => redirect()->route('inicio'));
Route::get('/inicio', fn() => view('inicio'))->middleware('auth')->name('inicio');

// Auth (guest)
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);
});

// API login (si lo usás)
Route::post('/api/login', [AuthController::class, 'login']);

// Logout y dashboard
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->middleware('auth')->name('logout');
Route::get('/dashboard', fn() => view('dashboard'))->middleware('auth')->name('dashboard');

// Rutas autenticadas
Route::middleware('auth')->group(function () {

    // Perfil (datos + cambio de contraseña)
    Route::prefix('perfil')->group(function () {
        Route::get('/', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::put('/', [ProfileController::class, 'update'])->name('profile.update');
        Route::put('/contraseña', [ProfileController::class, 'updatePassword'])->name('profile.password.update');
    });

    // ===== ADMIN: ABM de Usuarios =====
    Route::middleware([TipoUsuario::class . ':admin'])
        ->prefix('admin/usuarios')->name('admin.usuarios.')
        ->group(function () {
            Route::get('/', [UserController::class, 'index'])->name('index');
            Route::get('/create', [UserController::class, 'create'])->name('create');
            Route::post('/', [UserController::class, 'store'])->name('store');

            // route model binding con tu modelo User (PK ID_Usuario)
            Route::get('/{user}/edit', [UserController::class, 'edit'])
                ->whereNumber('user')->name('edit');
            Route::put('/{user}', [UserController::class, 'update'])
                ->whereNumber('user')->name('update');
            Route::delete('/{user}', [UserController::class, 'destroy'])
                ->whereNumber('user')->name('destroy');
        });

    // ===== Usuarios autenticados (free/premium/admin): ropas + accesorios =====
    Route::middleware([TipoUsuario::class . ':free,premium,admin'])->group(function () {
        Route::resource('ropas', RopaController::class);
        Route::resource('accesorios', AccesorioController::class);

        // imágenes de accesorios
        Route::delete('/imagenes/{imagen}', [ImagenAccesorioController::class, 'destroy'])->name('imagenes.destroy');
        Route::put('/imagenes/{imagen}/principal', [ImagenAccesorioController::class, 'marcarComoPrincipal'])->name('imagenes.principal');
    });
});

require __DIR__.'/auth.php';
