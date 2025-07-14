<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
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