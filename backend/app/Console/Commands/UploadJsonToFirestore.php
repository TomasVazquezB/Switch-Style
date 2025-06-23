<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use App\Services\FirebaseService;

class UploadJsonToFirestore extends Command
{
    protected $signature = 'upload:firestore';
    protected $description = 'Sube archivos JSON a Firestore';

    protected $firebase;

    public function __construct(FirebaseService $firebase)
    {
        parent::__construct();
        $this->firebase = $firebase;
    }

    public function handle()
    {
        $path = storage_path('app/');
        $files = File::files($path);

        $firestore = $this->firebase->getFirestore();

        foreach ($files as $file) {
            if ($file->getExtension() === 'json') {
                $collectionName = $file->getFilenameWithoutExtension();
                $this->info("Subiendo colección: $collectionName");

                $jsonContent = File::get($file);
                $items = json_decode($jsonContent, true);

                if (is_array($items)) {
                    foreach ($items as $item) {
                        if (isset($item['id'])) {
                            $docId = $item['id'];
                            unset($item['id']); // para evitar redundancia
                        } else {
                            $docId = null; // Firestore crea id automático
                        }

                        $collection = $firestore->collection($collectionName);

                        if ($docId) {
                            $collection->document($docId)->set($item);
                        } else {
                            $collection->add($item);
                        }
                    }
                    $this->info("✅ $collectionName subida correctamente.");
                } else {
                    $this->error("El archivo $collectionName no contiene datos JSON válidos.");
                }
            }
        }
    }
}
