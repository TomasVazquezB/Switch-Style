<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RopaController;
use App\Http\Controllers\UserController;

// Página de bienvenida
Route::get('/', function () {
    return view('welcome');
});

// Autenticación
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);
});

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->middleware('auth')->name('logout');

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware('auth')->name('dashboard');

// Rutas protegidas
Route::middleware('auth')->group(function () {

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // ADMIN
    Route::middleware('tipousuario:admin')->group(function () {
        Route::get('/admin', function () {
            return view('admin.dashboard');
        })->name('admin.dashboard');

        Route::get('/admin/usuarios', [UserController::class, 'index'])->name('admin.usuarios.index');
    });

    // FREE, PREMIUM, ADMIN
    Route::middleware('tipousuario:free,premium,admin')->group(function () {
        Route::resource('ropas', RopaController::class);
    });

    Route::get('/test-middleware', function () {
    return '¡Middleware funcionando!';
})->middleware('tipousuario:admin');

});



require __DIR__.'/auth.php';
