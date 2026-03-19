<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class CorsServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        $this->configureCors();
    }

    protected function configureCors(): void
    {
        $origins = config('cors.allowed_origins');
        
        if (is_string($origins) && $origins) {
            $originList = array_map('trim', explode(',', $origins));
            
            config(['cors.allowed_origins' => $originList]);
        }
    }
}