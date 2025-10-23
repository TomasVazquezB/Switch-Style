<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('accesorios') || !Schema::hasColumn('accesorios', 'ID_Usuario')) {
            return;
        }

        Schema::table('accesorios', function (Blueprint $table) {
            $table->unsignedInteger('ID_Usuario')->change();
        });

        $exists = collect(DB::select("
            SELECT CONSTRAINT_NAME
            FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
            WHERE TABLE_SCHEMA = DATABASE()
              AND TABLE_NAME = 'accesorios'
              AND COLUMN_NAME = 'ID_Usuario'
              AND REFERENCED_TABLE_NAME IS NOT NULL
        "))->isNotEmpty();

        if (!$exists) {
            Schema::table('accesorios', function (Blueprint $table) {
                $table->foreign('ID_Usuario', 'accesorios_id_usuario_foreign')
                      ->references('ID_Usuario')->on('usuario')
                      ->onDelete('cascade');
            });
        }
    }

    public function down(): void
    {
        if (!Schema::hasTable('accesorios') || !Schema::hasColumn('accesorios', 'ID_Usuario')) {
            return;
        }

        $fks = DB::select("
            SELECT CONSTRAINT_NAME
            FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
            WHERE TABLE_SCHEMA = DATABASE()
              AND TABLE_NAME = 'accesorios'
              AND COLUMN_NAME = 'ID_Usuario'
              AND REFERENCED_TABLE_NAME IS NOT NULL
        ");

        Schema::table('accesorios', function (Blueprint $table) use ($fks) {
            foreach ($fks as $fk) {
                $table->dropForeign($fk->CONSTRAINT_NAME);
            }
        });

        Schema::table('accesorios', function (Blueprint $table) {
            $table->unsignedBigInteger('ID_Usuario')->change();
        });
    }
};
