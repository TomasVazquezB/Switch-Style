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
    Schema::table('ropas', function (Blueprint $table) {
        $table->unsignedBigInteger('ID_Usuario')->after('genero_id');

        $table->foreign('ID_Usuario')->references('ID_Usuario')->on('usuario')->onDelete('cascade');
    });
}

public function down()
{
    Schema::table('ropas', function (Blueprint $table) {
        $table->dropForeign(['ID_Usuario']);
        $table->dropColumn('ID_Usuario');
    });
}

};
