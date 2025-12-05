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
        Schema::create('analytics_metrics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('proyecto_id')->constrained('proyectos')->onDelete('cascade');
            $table->string('metric_type', 50); // finance, tasks, chat
            $table->string('metric_name', 100); // transactions.count.daily, etc
            $table->decimal('value', 15, 2);
            $table->json('metadata')->nullable();
            $table->dateTime('period_start');
            $table->dateTime('period_end');
            $table->timestamps();

            // Indexes for performance
            $table->index(['proyecto_id', 'metric_type']);
            $table->index(['period_start', 'period_end']);
            $table->index(['metric_type', 'metric_name']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('analytics_metrics');
    }
};
