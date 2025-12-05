<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();

// Process automatic bill payments daily at 6:00 AM
Schedule::job(new \App\Jobs\ProcessAutoBills)->daily()->at('06:00');

use Illuminate\Support\Facades\Schedule;

// Process automatic bill payments daily at 6:00 AM
Schedule::job(new \App\Jobs\ProcessAutoBills)->daily()->at('06:00');

// Generate monthly recurring bills daily at 6:30 AM
Schedule::job(new \App\Jobs\ProcessRecurringBills)->daily()->at('06:30');

Schedule::command('finance:check-obligations')->dailyAt('09:00');
