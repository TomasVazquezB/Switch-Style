<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class ExportMySQLToJson extends Command
{
    protected $signature = 'export:mysql-json';
    protected $description = 'Exporta tablas MySQL a archivos JSON';

    public function handle()
    {
        $tablas = ['accesorios', 'cache', 'cache_locks', 'categorias','generos','imagenes','imagenes_accesorios','migrations','passworld_reset_tokens','personal_access_tokens','ropas','ropa_talla','sessions','suscripcion','tallas','tienda','usuario','valoracion']; // <- Cambia por tus tablas

        foreach ($tablas as $tabla) {
            $datos = DB::table($tabla)->get();
            $json = $datos->toJson(JSON_PRETTY_PRINT);
            File::put(storage_path("app/{$tabla}.json"), $json);
            $this->info("✅ Exportado {$tabla}.json");
        }
    }
}
