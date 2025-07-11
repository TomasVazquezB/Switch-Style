<?php

namespace App\Services;

use Google\Cloud\Firestore\FirestoreClient;

class FirebaseService
{
    protected FirestoreClient $firestore;

    public function __construct()
    {
        $this->firestore = new FirestoreClient([
            'projectId' => env('FIREBASE_PROJECT_ID'),
            'keyFilePath' => config('firebase.credentials.file'),
            'transport' => env('FIRESTORE_TRANSPORT', 'grpc'), 
        ]);
    }

    public function getFirestore(): FirestoreClient
    {
        return $this->firestore;
    }

    public function getCollection(string $collectionName)
    {
        return $this->firestore->collection($collectionName);
    }

    public function getDocument(string $collectionName, string $documentId)
    {
        return $this->firestore->collection($collectionName)->document($documentId);
    }

    public function setDocument(string $collectionName, string $documentId, array $data)
    {
        $this->firestore->collection($collectionName)->document($documentId)->set($data);
    }

    public function addDocument(string $collectionName, array $data)
    {
        $this->firestore->collection($collectionName)->add($data);
    }

    public function deleteDocument(string $collectionName, string $documentId)
    {
        $this->firestore->collection($collectionName)->document($documentId)->delete();
    }
}
