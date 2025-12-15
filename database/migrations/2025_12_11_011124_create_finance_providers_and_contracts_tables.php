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
        Schema::create('providers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('proyecto_id')->constrained('proyectos')->onDelete('cascade');
            $table->string('name');
            $table->string('tax_id')->nullable(); // NIT/RUT
            $table->string('contact_name')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->text('address')->nullable();
            $table->string('payment_terms')->default('immediate');
            $table->string('category')->default('goods');
            $table->text('notes')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('supply_contracts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('proyecto_id')->constrained('proyectos')->onDelete('cascade');
            $table->foreignId('provider_id')->constrained('providers')->onDelete('cascade');
            $table->string('name');
            $table->string('frequency'); // weekly, monthly
            $table->integer('recurrence_day')->nullable();
            $table->json('items')->nullable(); // Snapshot of agreed items/prices
            $table->decimal('total_amount', 15, 2)->default(0);
            $table->string('currency_code')->default('COP');
            $table->boolean('auto_generate_invoice')->default(false);
            $table->foreignId('billing_category_id')->nullable()->constrained('categorias')->nullOnDelete();
            $table->foreignId('target_account_id')->nullable()->constrained('cuentas')->nullOnDelete();
            $table->timestamp('last_run_at')->nullable();
            $table->timestamp('next_run_at')->nullable();
            $table->string('status')->default('active');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('supply_contracts');
        Schema::dropIfExists('providers');
    }
};
