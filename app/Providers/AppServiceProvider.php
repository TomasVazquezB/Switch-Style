<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Kreait\Firebase\Factory;
use Kreait\Firebase\Auth as FirebaseAuth;
use Kreait\Firebase\Contract\Firestore;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // 🔐 Firebase Auth Singleton
        $this->app->singleton(FirebaseAuth::class, function () {
            $serviceAccountPath = app()->environment('production')
                ? '/tmp/firebase_credentials.json'
                : base_path('firebase_credentials.json');

            $factory = (new Factory)->withServiceAccount($serviceAccountPath);
            return $factory->createAuth();
        });

        // 🔥 Firestore Singleton (FALTA ESTO)
        $this->app->singleton(Firestore::class, function () {
            $serviceAccountPath = app()->environment('production')
                ? '/tmp/firebase_credentials.json'
                : base_path('firebase_credentials.json');

            return (new Factory)
                ->withServiceAccount($serviceAccountPath)
                ->createFirestore();
        });
    }

    public function boot(): void
    {
        // 🔐 Guardar JSON en producción en /tmp si no existe
        if (app()->environment('production')) {
            $json = env('FIREBASE_CREDENTIALS_JSON');
            if ($json && !file_exists('/tmp/firebase_credentials.json')) {
                file_put_contents('/tmp/firebase_credentials.json', $json);
            }
        }
    }
}
