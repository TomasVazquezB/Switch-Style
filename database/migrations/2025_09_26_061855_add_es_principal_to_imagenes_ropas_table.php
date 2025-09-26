<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('imagenes_ropas', function (Blueprint $table) {
            // booleano, por defecto false
            $table->boolean('es_principal')->default(false)->after('ruta');
        });
    }

    public function down(): void
    {
        Schema::table('imagenes_ropas', function (Blueprint $table) {
            $table->dropColumn('es_principal');
        });
    }
};
