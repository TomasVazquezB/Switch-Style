<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('ropas', function (Blueprint $table) {
            if (Schema::hasColumn('ropas', 'cantidad')) {
                $table->dropColumn('cantidad');
            }
        });
    }

    public function down(): void
    {
        Schema::table('ropas', function (Blueprint $table) {
            $table->integer('cantidad')->default(0);
        });
    }
};
