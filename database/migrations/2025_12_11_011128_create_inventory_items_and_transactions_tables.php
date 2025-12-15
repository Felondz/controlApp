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
        Schema::create('inventory_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('proyecto_id')->constrained('proyectos')->onDelete('cascade');
            $table->foreignId('parent_id')->nullable()->constrained('inventory_items')->nullOnDelete(); // Variants
            $table->string('sku')->nullable();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('type')->default('raw_material'); // raw_material, finished_good, service
            $table->string('unit')->default('unit');
            $table->json('attributes')->nullable(); // { color: red, size: L }
            $table->decimal('min_stock_level', 10, 2)->default(0);
            $table->decimal('max_stock_level', 10, 2)->nullable();
            $table->decimal('current_stock', 15, 2)->default(0);
            $table->decimal('cost_price', 15, 2)->default(0); // Avg Cost
            $table->decimal('sale_price', 15, 2)->default(0);
            $table->boolean('is_active')->default(true);
            $table->softDeletes();
            $table->timestamps();

            // Unique SKU per project (if SKU is set)
            $table->unique(['proyecto_id', 'sku']);
        });

        Schema::create('inventory_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('proyecto_id')->constrained('proyectos')->onDelete('cascade');
            $table->foreignId('inventory_item_id')->constrained('inventory_items')->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('type'); // purchase, sale, adjustment, production_in...
            $table->decimal('quantity', 15, 2); // +/-
            $table->decimal('unit_price', 15, 2)->default(0);
            $table->decimal('total_amount', 15, 2)->default(0);

            // Polymorphic reference (SupplyContract, LoteProduccion, Transaccion)
            $table->nullableMorphs('reference');

            $table->text('notes')->nullable();
            $table->string('status')->default('draft'); // draft, confirmed
            $table->timestamp('transaction_date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventory_transactions');
        Schema::dropIfExists('inventory_items');
    }
};
