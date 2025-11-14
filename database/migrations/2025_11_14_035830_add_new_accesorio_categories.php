<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('categorias')->insert([
            ['nombre' => 'Carteras y Mochilas'],
            ['nombre' => 'Billeteras'],
            ['nombre' => 'Cinturones'],
            ['nombre' => 'Gorras'],
        ]);
    }

    public function down(): void
    {
        DB::table('categorias')->whereIn('nombre', [
            'Carteras y Mochilas',
            'Billeteras',
            'Cinturones',
            'Gorras'
        ])->delete();
    }
};
