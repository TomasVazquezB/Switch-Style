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
    Schema::table('accesorios', function (Blueprint $table) {
        $table->integer('stock')->default(0);
    });
}

public function down()
{
    Schema::table('accesorios', function (Blueprint $table) {
        $table->dropColumn('stock');
    });
}

};
