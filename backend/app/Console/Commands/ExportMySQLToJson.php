<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Kreait\Laravel\Firebase\Facades\Firebase;

class MigrateAndUploadOptimized extends Command
{
    protected $signature = 'migrate:upload-firestore-optimized';
    protected $description = 'Exporta tablas MySQL y sube a Firestore con relaciones anidadas y batches optimizados';

    // Tablas planas (sin relaciones)
    protected $tablasPlanas = [
        'accesorios', 'cache', 'cache_locks', 'categorias', 'generos', 'imagenes',
        'imagenes_accesorios', 'migrations', 'passworld_reset_tokens',
        'personal_access_tokens', 'ropas', 'ropa_talla', 'sessions',
        'tallas', 'tienda',
    ];

    public function handle()
    {
        $firestore = Firebase::firestore()->database();

        $this->info("----- Exportando y subiendo tablas planas -----");
        foreach ($this->tablasPlanas as $tabla) {
            $this->uploadTablePlain($firestore, $tabla);
        }

        $this->info("----- Exportando y subiendo usuarios con relaciones anidadas -----");
        $this->uploadUsuariosConRelaciones($firestore);

        $this->info("¡Migración y subida completa!");
    }

    // Método para subir tablas simples, en chunks y batches
    protected function uploadTablePlain($firestore, $tabla)
    {
        $this->info("Procesando tabla: {$tabla}");

        $chunkSize = 500; // max batch size Firestore
        $query = DB::table($tabla);

        $query->chunk($chunkSize, function ($items) use ($firestore, $tabla) {
            $batch = $firestore->batch();
            foreach ($items as $item) {
                $data = (array) $item;
                $docId = $data['id'] ?? null;
                if ($docId) {
                    unset($data['id']);
                    $docRef = $firestore->collection($tabla)->document((string) $docId);
                    $batch->set($docRef, $data);
                } else {
                    $docRef = $firestore->collection($tabla)->newDocument();
                    $batch->set($docRef, $data);
                }
            }
            $batch->commit();
            $this->info(" - Subidos " . count($items) . " documentos a {$tabla} en batch.");
        });
    }

    // Método para subir usuarios con relaciones anidadas: valoracion y suscripcion
    protected function uploadUsuariosConRelaciones($firestore)
    {
        $chunkSize = 200; // más pequeño por datos anidados

        DB::table('usuario')->orderBy('id')->chunk($chunkSize, function ($usuarios) use ($firestore) {

            $batch = $firestore->batch();

            foreach ($usuarios as $usuario) {
                $userData = (array) $usuario;

                // Obtener valoraciones para este usuario
                $valoraciones = DB::table('valoracion')
                    ->where('usuario_id', $usuario->id)
                    ->get()
                    ->map(function ($v) {
                        $vArray = (array) $v;
                        unset($vArray['usuario_id']); // no repetir FK
                        unset($vArray['id']); // opcional, para que firestore genere ID
                        return $vArray;
                    })
                    ->toArray();

                // Obtener suscripciones para este usuario
                $suscripciones = DB::table('suscripcion')
                    ->where('usuario_id', $usuario->id)
                    ->get()
                    ->map(function ($s) {
                        $sArray = (array) $s;
                        unset($sArray['usuario_id']);
                        unset($sArray['id']);
                        return $sArray;
                    })
                    ->toArray();

                // Añadir relaciones anidadas
                $userData['valoraciones'] = $valoraciones;
                $userData['suscripciones'] = $suscripciones;

                // Eliminar id para usarlo como docId
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
