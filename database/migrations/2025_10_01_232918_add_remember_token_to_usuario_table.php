<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('usuario', function (Blueprint $table) {
            // agrega columna remember_token si no existe
            if (!Schema::hasColumn('usuario', 'remember_token')) {
                $table->rememberToken()->nullable()->after('Contraseña');
            }
        });
    }

    public function down(): void
    {
        Schema::table('usuario', function (Blueprint $table) {
            if (Schema::hasColumn('usuario', 'remember_token')) {
                $table->dropColumn('remember_token');
            }
        });
    }
};
