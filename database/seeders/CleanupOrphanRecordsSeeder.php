<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;
use App\Models\Ropa;
use App\Models\Accesorio;
use App\Models\User;

class CleanupOrphanRecordsSeeder extends Seeder
{
    public function run(): void
    {
        $validUserIds = User::pluck('ID_Usuario');

        if (Schema::hasTable('ropas')) {
            Ropa::whereNotIn('ID_Usuario', $validUserIds)->delete();
        }

        if (Schema::hasTable('accesorios')) {
            Accesorio::whereNotIn('ID_Usuario', $validUserIds)->delete();
        }
    }
}
