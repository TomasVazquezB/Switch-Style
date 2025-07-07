<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('favoritos', function (Blueprint $table) {
        $table->id();
        $table->unsignedInteger('user_id');
$table->foreign('user_id')->references('ID_Usuario')->on('usuario')->onDelete('cascade');
        $table->unsignedBigInteger('favoritable_id');
        $table->string('favoritable_type');
        $table->timestamps();

        $table->unique(['user_id', 'favoritable_id', 'favoritable_type']);
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('favoritos');
    }
};
