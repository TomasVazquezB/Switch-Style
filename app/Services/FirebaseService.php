<?php

namespace App\Services;

use Kreait\Firebase\Factory;
use Kreait\Firebase\Auth;
use Google\Cloud\Firestore\FirestoreClient;

class FirebaseService
{
    protected Auth $auth;
    protected FirestoreClient $firestore;

    public function __construct()
    {
        $firebaseCredentials = config('firebase.credentials.file');

        if (!file_exists($firebaseCredentials)) {
            throw new \Exception("Archivo de credenciales Firebase no encontrado en: $firebaseCredentials");
        }

        $factory = (new Factory)
            ->withServiceAccount($firebaseCredentials);

        $this->auth = $factory->createAuth();
        $this->firestore = $factory->createFirestore()->database();
    }

    public function getAuth(): Auth
    {
        return $this->auth;
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
