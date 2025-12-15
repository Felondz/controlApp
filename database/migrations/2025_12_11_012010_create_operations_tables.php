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
        Schema::create('etapas_proceso', function (Blueprint $table) {
            $table->id();
            $table->foreignId('proyecto_id')->constrained('proyectos')->onDelete('cascade');
            $table->string('name'); // Germinación, Fermentación
            $table->integer('order')->default(0);
            $table->text('description')->nullable();
            $table->boolean('requires_quality_check')->default(false);
            $table->integer('estimated_duration_days')->default(0);
            $table->timestamps();
        });

        Schema::create('lotes_produccion', function (Blueprint $table) {
            $table->id();
            $table->foreignId('proyecto_id')->constrained('proyectos')->onDelete('cascade');
            $table->string('code')->nullable(); // LOTE-2023-001

            // Product being produced (Nullable if unknown at start)
            $table->foreignId('inventory_item_id')->nullable()->constrained('inventory_items')->nullOnDelete();

            // Current stage
            $table->foreignId('stage_id')->nullable()->constrained('etapas_proceso')->nullOnDelete();

            $table->string('status')->default('planned'); // planned, in_progress, completed, discarded
            $table->date('start_date')->nullable();
            $table->date('estimated_end_date')->nullable();
            $table->date('actual_end_date')->nullable();

            $table->decimal('initial_quantity', 15, 2)->default(0);
            $table->decimal('current_quantity', 15, 2)->default(0);

            $table->text('notes')->nullable();

            // Responsible user
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();

            $table->softDeletes();
            $table->timestamps();

            // Indexes for faster lookups
            $table->index(['proyecto_id', 'status']);
            $table->index('code');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lotes_produccion');
        Schema::dropIfExists('etapas_proceso');
    }
};
