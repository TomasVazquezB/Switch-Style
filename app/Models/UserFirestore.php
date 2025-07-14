<?php

namespace App\Models;

use App\Services\FirestoreService;
use Google\Cloud\Firestore\DocumentReference;

class UserFirestore
{
    protected static string $collection = 'usuarios';

    protected static function firestore()
    {
        return new FirestoreService();
    }

    public static function create(array $data)
    {
        return static::firestore()->collection(static::$collection)->add($data);
    }

    public static function findByUID(string $uid): ?DocumentReference
    {
        $docs = static::firestore()
            ->collection(static::$collection)
            ->where('uid', '=', $uid)
            ->documents();

        if ($docs->isEmpty()) {
            return null;
        }

        return $docs->rows()[0];
    }

    public static function updateByUID(string $uid, array $data): bool
    {
        $doc = static::findByUID($uid);
        if (!$doc) return false;

        $doc->reference()->update($data);
        return true;
    }

    public static function deleteByUID(string $uid): bool
    {
        $doc = static::findByUID($uid);
        if (!$doc) return false;

        $doc->reference()->delete();
        return true;
    }
}
