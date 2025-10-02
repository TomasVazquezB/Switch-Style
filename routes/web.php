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

Route::get('/', fn() => redirect()->route('inicio'));

Route::get('/inicio', fn() => view('inicio'))->middleware('auth')->name('inicio');

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);
});

Route::post('/api/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->middleware('auth')->name('logout');
Route::get('/dashboard', fn() => view('dashboard'))->middleware('auth')->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::prefix('perfil')->group(function () {
        Route::get('/', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::put('/', [ProfileController::class, 'update'])->name('profile.update');
        Route::put('/contraseña', [ProfileController::class, 'updatePassword'])->name('profile.password.update');
    });

    Route::middleware([TipoUsuario::class . ':admin'])->prefix('admin/usuarios')->name('admin.usuarios.')->group(function () {
        Route::get('/', [UserController::class, 'index'])->name('index');
        Route::get('/create', [UserController::class, 'create'])->name('create');
        Route::post('/', [UserController::class, 'store'])->name('store');
        Route::get('/{user}/edit', [UserController::class, 'edit'])->name('edit');
        Route::put('/{user}', [UserController::class, 'update'])->name('update');
        Route::delete('/{user}', [UserController::class, 'destroy'])->name('destroy');
    });

    Route::middleware([TipoUsuario::class . ':free,premium,admin'])->group(function () {
        Route::resource('ropas', RopaController::class);
        Route::resource('accesorios', AccesorioController::class);

        Route::delete('/imagenes/{imagen}', [ImagenAccesorioController::class, 'destroy'])->name('imagenes.destroy');
        Route::put('/imagenes/{imagen}/principal', [ImagenAccesorioController::class, 'marcarComoPrincipal'])->name('imagenes.principal');
    });

});

require __DIR__.'/auth.php';
