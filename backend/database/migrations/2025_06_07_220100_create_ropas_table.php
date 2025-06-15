<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('ropas', function (Blueprint $table) {
            $table->id();
            $table->string('titulo');
            $table->text('descripcion');
            $table->decimal('precio', 8, 2);
            $table->integer('cantidad');
            $table->string('talla'); // S, M, L, XL, XXL
            $table->string('categoria'); // Remeras, Pantalones, etc.
            $table->string('genero'); // Hombre, Mujer, Chicos
            $table->string('ruta_imagen')->nullable(); // ruta de la imagen subida
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ropas');
    }
};
