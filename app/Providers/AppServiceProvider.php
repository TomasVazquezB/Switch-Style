<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Kreait\Firebase\Factory;
use Kreait\Firebase\Auth as FirebaseAuth;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(FirebaseAuth::class, function () {
            $serviceAccountPath = app()->environment('production')
                ? '/tmp/firebase_credentials.json'
                : base_path('firebase_credentials.json');

            $factory = (new Factory)->withServiceAccount($serviceAccountPath);
            return $factory->createAuth();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (app()->environment('production')) {
            $json = env('FIREBASE_CREDENTIALS_JSON');
            if ($json && !file_exists('/tmp/firebase_credentials.json')) {
                file_put_contents('/tmp/firebase_credentials.json', $json);
            }
        }
    }
}
