<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('ropas', function (Blueprint $table) {
            $table->dropColumn(['categoria', 'talla', 'genero']);

            $table->foreignId('categoria_id')->after('cantidad')->constrained('categorias')->onDelete('cascade');
            $table->foreignId('talla_id')->after('categoria_id')->constrained('tallas')->onDelete('cascade');
            $table->foreignId('genero_id')->after('talla_id')->constrained('generos')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('ropas', function (Blueprint $table) {
            $table->dropForeign(['categoria_id']);
            $table->dropForeign(['talla_id']);
            $table->dropForeign(['genero_id']);

            $table->dropColumn(['categoria_id', 'talla_id', 'genero_id']);

            $table->string('categoria');
            $table->string('talla');
            $table->string('genero');
        });
    }
};
