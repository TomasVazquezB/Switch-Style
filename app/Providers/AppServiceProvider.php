<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;


class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        if (!config('services.firebase.enabled')) {
            return;
        }
    }

    public function boot(): void
    {
        if (!config('services.firebase.enabled')) {
            return;
        }

    }
}
