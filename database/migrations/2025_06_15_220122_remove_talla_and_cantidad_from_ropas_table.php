<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('ropas', function (Blueprint $table) {
            $table->dropForeign(['talla_id']);
            $table->dropColumn('talla_id');
            $table->dropColumn('cantidad');
        });
    }

    public function down(): void {
        Schema::table('ropas', function (Blueprint $table) {
            $table->foreignId('talla_id')->nullable()->constrained('tallas');
            $table->integer('cantidad')->default(0);
        });
    }
};