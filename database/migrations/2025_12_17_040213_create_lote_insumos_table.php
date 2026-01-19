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
        Schema::create('lote_insumos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lote_produccion_id')->constrained('lotes_produccion')->onDelete('cascade');
            $table->foreignId('inventory_item_id')->constrained('inventory_items')->onDelete('restrict');
            $table->foreignId('stage_id')->nullable()->constrained('etapas_proceso')->onDelete('set null');
            $table->decimal('quantity', 10, 2);
            $table->decimal('unit_cost', 15, 2);
            $table->decimal('total_cost', 15, 2);
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lote_insumos');
    }
};
