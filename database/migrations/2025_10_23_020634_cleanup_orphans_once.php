<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("
            DELETE r FROM ropas r
            LEFT JOIN usuario u ON u.ID_Usuario = r.ID_Usuario
            WHERE u.ID_Usuario IS NULL
        ");

        if (DB::select("SHOW TABLES LIKE 'accesorios'")) {
            DB::statement("
                DELETE a FROM accesorios a
                LEFT JOIN usuario u ON u.ID_Usuario = a.ID_Usuario
                WHERE u.ID_Usuario IS NULL
            ");
        }

        if (DB::select("SHOW TABLES LIKE 'imagenes'")) {
            DB::statement("
                DELETE i FROM imagenes i
                LEFT JOIN ropas r ON r.id = i.ropa_id
                WHERE r.id IS NULL
            ");
        }

        if (DB::select("SHOW TABLES LIKE 'imagenes_accesorios'")) {
            DB::statement("
                DELETE ia FROM imagenes_accesorios ia
                LEFT JOIN accesorios a ON a.id = ia.accesorio_id
                WHERE a.id IS NULL
            ");
        }
    }

    public function down(): void {}
};
