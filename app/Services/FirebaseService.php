<?php

namespace App\Services;

use Kreait\Firebase\Factory;
use Kreait\Firebase\Firestore;

class FirebaseService
{
    protected Firestore $firestore;

    public function __construct()
    {
        $factory = (new Factory)
            ->withServiceAccount(env('GOOGLE_APPLICATION_CREDENTIALS'));
        
        $this->firestore = $factory->createFirestore();
    }

    public function collection(string $name)
    {
        return $this->firestore->database()->collection($name);
    }

    public function getDocument(string $collectionName, string $documentId)
    {
        return $this->collection($collectionName)->document($documentId);
    }

    public function setDocument(string $collectionName, string $documentId, array $data)
    {
        $this->getDocument($collectionName, $documentId)->set($data);
    }

    public function addDocument(string $collectionName, array $data)
    {
        $this->collection($collectionName)->add($data);
    }

    public function deleteDocument(string $collectionName, string $documentId)
    {
        $this->getDocument($collectionName, $documentId)->delete();
    }
}
