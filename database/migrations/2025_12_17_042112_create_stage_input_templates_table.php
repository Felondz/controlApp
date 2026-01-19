<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('stage_input_templates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('etapa_proceso_id')->constrained('etapas_proceso')->onDelete('cascade');
            $table->foreignId('inventory_item_id')->constrained('inventory_items')->onDelete('cascade');
            $table->decimal('quantity', 10, 2); // Standard amount
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stage_input_templates');
    }
};
