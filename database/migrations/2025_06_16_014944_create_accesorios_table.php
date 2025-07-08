<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('accesorios', function (Blueprint $table) {
            $table->id();

            $table->string('titulo');
            $table->text('descripcion')->nullable();
            $table->decimal('precio', 8, 2);
            $table->string('ruta_imagen')->nullable();

            $table->foreignId('categoria_id')->constrained('categorias')->onDelete('cascade');
            $table->foreignId('ID_Usuario')->constrained('users')->onDelete('cascade');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('accesorios');
    }
};
