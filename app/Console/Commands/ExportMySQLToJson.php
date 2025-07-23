<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Kreait\Laravel\Firebase\Facades\Firebase;

class ExportMySQLToJson extends Command
{
    protected $signature = 'export:mysql-to-firestore';
    protected $description = 'Exporta tablas MySQL y sube a Firestore con relaciones anidadas y batches optimizados';

    protected $tablasPlanas = ['accesorios', 'cache', 'cache_locks', 'categorias', 'generos', 'imagenes','imagenes_accesorios', 'migrations', 'passworld_reset_tokens','personal_access_tokens', 'ropas', 'ropa_talla', 'sessions','tallas', 'tienda',];

    public function handle()
    {
        $firestore = Firebase::firestore()->database();

        $this->info("----- Exportando y subiendo tablas planas -----");
        foreach ($this->tablasPlanas as $tabla) {$this->uploadTablePlain($firestore, $tabla);}

        $this->info("----- Exportando y subiendo usuarios con relaciones anidadas -----");
        $this->uploadUsuariosConRelaciones($firestore);

        $this->info("¡Migración y subida completa!");
    }
    protected function uploadTablePlain($firestore, $tabla)
    {
        $this->info("Procesando tabla: {$tabla}");

        $chunkSize = 500; 
        $query = DB::table($tabla);

        $query->chunk($chunkSize, function ($items) use ($firestore, $tabla) {
            $batch = $firestore->batch();
            foreach ($items as $item) {$data = (array) $item; $docId = $data['id'] ?? null;
                if ($docId) {unset($data['id']); $docRef = $firestore->collection($tabla)->document((string) $docId); $batch->set($docRef, $data);
                } else {
                    $docRef = $firestore->collection($tabla)->newDocument();
                    $batch->set($docRef, $data);
                }
            }
            $batch->commit();
            $this->info(" - Subidos " . count($items) . " documentos a {$tabla} en batch.");
        });
    }

    protected function uploadUsuariosConRelaciones($firestore)
    {
        $chunkSize = 200; 

        DB::table('usuario')->orderBy('id')->chunk($chunkSize, function ($usuarios) use ($firestore) {

            $batch = $firestore->batch();

            foreach ($usuarios as $usuario) {$userData = (array) $usuario;

                $valoraciones = DB::table('valoracion')
                    ->where('usuario_id', $usuario->id)
                    ->get()
                    ->map(function ($v) {$vArray = (array) $v; unset($vArray['usuario_id']); unset($vArray['id']); return $vArray;})
                    ->toArray();

                $suscripciones = DB::table('suscripcion')
                    ->where('usuario_id', $usuario->id)
                    ->get()
                    ->map(function ($s) {$sArray = (array) $s;unset($sArray['usuario_id']);unset($sArray['id']);
                        return $sArray;})
                    ->toArray();

                $userData['valoraciones'] = $valoraciones;
                $userData['suscripciones'] = $suscripciones;

                $docId = (string) $userData['id'];
                unset($userData['id']);

                $docRef = $firestore->collection('usuario')->document($docId);
                $batch->set($docRef, $userData);
            }

            $batch->commit();
            $this->info(" - Subidos " . count($usuarios) . " usuarios con relaciones anidadas.");
        });
    }
}