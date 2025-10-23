<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('ropas') && Schema::hasColumn('ropas','ID_Usuario')) {
            Schema::table('ropas', function (Blueprint $table) {
                $table->unsignedInteger('ID_Usuario')->change();
            });

            DB::statement("
                DELETE r FROM ropas r
                LEFT JOIN usuario u ON u.ID_Usuario = r.ID_Usuario
                WHERE u.ID_Usuario IS NULL
            ");

            $exists = collect(DB::select("
                SELECT CONSTRAINT_NAME
                FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
                WHERE TABLE_SCHEMA = DATABASE()
                  AND TABLE_NAME = 'ropas'
                  AND COLUMN_NAME = 'ID_Usuario'
                  AND REFERENCED_TABLE_NAME IS NOT NULL
            "))->isNotEmpty();

            if (!$exists) {
                Schema::table('ropas', function (Blueprint $table) {
                    $table->foreign('ID_Usuario', 'ropas_id_usuario_foreign')
                          ->references('ID_Usuario')->on('usuario')
                          ->onDelete('cascade');
                });
            }
        }
    }

    public function down(): void
    {
        if (!Schema::hasTable('ropas') || !Schema::hasColumn('ropas','ID_Usuario')) return;

        $fks = DB::select("
            SELECT CONSTRAINT_NAME
            FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
            WHERE TABLE_SCHEMA = DATABASE()
              AND TABLE_NAME = 'ropas'
              AND COLUMN_NAME = 'ID_Usuario'
              AND REFERENCED_TABLE_NAME IS NOT NULL
        ");

        Schema::table('ropas', function (Blueprint $table) use ($fks) {
            foreach ($fks as $fk) {
                $table->dropForeign($fk->CONSTRAINT_NAME);
            }
        });
    }
};
