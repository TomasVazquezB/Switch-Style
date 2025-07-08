<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('imagenes_accesorios', function (Blueprint $table) {
            $table->id();
            $table->string('ruta');
            $table->foreignId('accesorio_id')->constrained('accesorios')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('imagenes_accesorios');
    }
};
