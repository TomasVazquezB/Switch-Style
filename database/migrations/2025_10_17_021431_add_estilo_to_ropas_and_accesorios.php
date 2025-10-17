<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Tabla ROPAS
        if (Schema::hasTable('ropas') && !Schema::hasColumn('ropas', 'estilo')) {
            Schema::table('ropas', function (Blueprint $table) {
                $table->enum('estilo', ['claro', 'oscuro'])
                      ->default('claro')
                      ->after('ruta_imagen');
            });
        }

        // Tabla ACCESORIOS
        if (Schema::hasTable('accesorios') && !Schema::hasColumn('accesorios', 'estilo')) {
            Schema::table('accesorios', function (Blueprint $table) {
                $table->enum('estilo', ['claro', 'oscuro'])
                      ->default('claro')
                      ->after('ruta_imagen');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('ropas', 'estilo')) {
            Schema::table('ropas', function (Blueprint $table) {
                $table->dropColumn('estilo');
            });
        }

        if (Schema::hasColumn('accesorios', 'estilo')) {
            Schema::table('accesorios', function (Blueprint $table) {
                $table->dropColumn('estilo');
            });
        }
    }
};
