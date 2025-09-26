<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (!Schema::hasColumn('imagenes', 'es_principal')) {
            Schema::table('imagenes', function (Blueprint $table) {
                $table->boolean('es_principal')->default(false)->after('ruta');
            });
        }
        // Si ya existe, no hace nada y el deploy sigue.
    }

    public function down(): void
    {
        if (Schema::hasColumn('imagenes', 'es_principal')) {
            Schema::table('imagenes', function (Blueprint $table) {
                $table->dropColumn('es_principal');
            });
        }
    }
};
