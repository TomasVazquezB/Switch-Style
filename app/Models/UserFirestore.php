<?php

namespace App\Models;

use App\Services\FirestoreService;

class UserFirestore
{
    protected static string $collection = 'usuarios';

    public static function create(array $data)
    {
        return (new FirestoreService())->collection(static::$collection)->add($data);
    }

    public static function findByUID(string $uid)
    {
        $docs = (new FirestoreService())
            ->collection(static::$collection)
            ->where('uid', '=', $uid)
            ->documents();

        return $docs->rows()[0] ?? null;
    }
}
