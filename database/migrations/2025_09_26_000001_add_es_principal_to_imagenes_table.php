<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('imagenes', function (Blueprint $table) {
            if (!Schema::hasColumn('imagenes', 'es_principal')) {
                $table->boolean('es_principal')->default(false)->after('ruta');
            }
        });
    }

    public function down(): void
    {
        Schema::table('imagenes', function (Blueprint $table) {
            if (Schema::hasColumn('imagenes', 'es_principal')) {
                $table->dropColumn('es_principal');
            }
        });
    }
};
