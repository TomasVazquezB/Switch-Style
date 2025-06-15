<?php

// database/migrations/xxxx_xx_xx_create_ropa_talla_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('ropa_talla', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ropa_id')->constrained('ropas')->onDelete('cascade');
            $table->foreignId('talla_id')->constrained('tallas')->onDelete('cascade');
            $table->integer('cantidad')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('ropa_talla');
    }
};
