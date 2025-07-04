<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
{
    Schema::create('imagenes', function (Blueprint $table) {
        $table->id();
        $table->string('ruta');
        $table->foreignId('ropa_id')->constrained('ropas')->onDelete('cascade');
        $table->timestamps();
    });
}

    public function down(): void
    {
        Schema::dropIfExists('imagenes');
    }
};
