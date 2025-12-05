<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('notification_preferences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('event_type', 100); // transaction_created, task_assigned, etc
            $table->string('channel', 50); // database, mail, broadcast
            $table->boolean('enabled')->default(true);
            $table->timestamps();

            // Unique constraint: one preference per user/event/channel combination
            $table->unique(['user_id', 'event_type', 'channel'], 'unique_preference');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notification_preferences');
    }
};
