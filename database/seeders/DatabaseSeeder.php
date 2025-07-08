<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Talla;
use App\Models\Categoria;
use App\Models\Genero;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
    
        // Tallas
        Talla::insert([
            ['nombre' => 'S'],
            ['nombre' => 'M'],
            ['nombre' => 'L'],
            ['nombre' => 'XL'],
            ['nombre' => 'XXL'],
        ]);

        // Categorías
        Categoria::insert([
            
            ['nombre' => 'Remeras'],
            ['nombre' => 'Camisas'],
            ['nombre' => 'Camperas'],
            ['nombre' => 'Shorts'],
            ['nombre' => 'Pantalónes'],
            ['nombre' => 'Faldas'],
            ['nombre' => 'Vestidos'],
            ['nombre' => 'Botas'],
            ['nombre' => 'Zapatillas'],
            ['nombre' => 'Collares'],
            ['nombre' => 'Anillos'],
            ['nombre' => 'Aritos'],
            
        ]);

        // Géneros
        Genero::insert([
            ['nombre' => 'Hombre'],
            ['nombre' => 'Mujer'],
            ['nombre' => 'Chicos'],
        ]);
    }
}
