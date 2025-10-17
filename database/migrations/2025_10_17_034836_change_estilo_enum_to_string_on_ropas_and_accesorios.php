<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Normaliza datos existentes a minúsculas
        if (Schema::hasColumn('ropas', 'estilo')) {
            DB::statement("UPDATE ropas SET estilo = LOWER(estilo)");
            DB::statement("ALTER TABLE ropas MODIFY COLUMN estilo VARCHAR(10) NOT NULL DEFAULT 'claro'");
        }

        if (Schema::hasColumn('accesorios', 'estilo')) {
            DB::statement("UPDATE accesorios SET estilo = LOWER(estilo)");
            DB::statement("ALTER TABLE accesorios MODIFY COLUMN estilo VARCHAR(10) NOT NULL DEFAULT 'claro'");
        }
    }

    public function down(): void
    {
        // Vuelve a ENUM si hicieras rollback (no recomendado)
        if (Schema::hasColumn('ropas', 'estilo')) {
            DB::statement("UPDATE ropas SET estilo = UPPER(estilo)");
            DB::statement("ALTER TABLE ropas MODIFY COLUMN estilo ENUM('claro','oscuro') NOT NULL DEFAULT 'claro'");
        }

        if (Schema::hasColumn('accesorios', 'estilo')) {
            DB::statement("UPDATE accesorios SET estilo = UPPER(estilo)");
            DB::statement("ALTER TABLE accesorios MODIFY COLUMN estilo ENUM('claro','oscuro') NOT NULL DEFAULT 'claro'");
        }
    }
};
