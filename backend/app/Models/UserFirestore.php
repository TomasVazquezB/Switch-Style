<?php

namespace App\Models;

class UserFirestore
{
    protected static string $collection = 'usuarios';

    protected static function firestore()
    {
        return app('firebase.firestore')->database();
    }

    public static function create(array $data)
    {
        return static::firestore()->collection(static::$collection)->add($data);
    }

    public static function findByUID(string $uid)
    {
        $doc = static::firestore()->collection(static::$collection)->document($uid);
        return $doc->snapshot()->exists() ? $doc : null;
    }

    public static function updateByUID(string $uid, array $data): bool
    {
        $doc = static::firestore()->collection(static::$collection)->document($uid);
        if (!$doc->snapshot()->exists()) return false;

        $doc->set($data, ['merge' => true]);
        return true;
    }

    public static function deleteByUID(string $uid): bool
    {
        $doc = static::firestore()->collection(static::$collection)->document($uid);
        if (!$doc->snapshot()->exists()) return false;

        $doc->delete();
        return true;
    }
}
