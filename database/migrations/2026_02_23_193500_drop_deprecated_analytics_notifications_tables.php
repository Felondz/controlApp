<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('analytics_metrics');
        Schema::dropIfExists('notification_preferences');
        // Note: 'notifications' table is Laravel's core notification table,
        // only drop if it was created by the deprecated module
        Schema::dropIfExists('notifications');
    }

    public function down(): void
    {
        // These tables are deprecated and should not be recreated
    }
};
