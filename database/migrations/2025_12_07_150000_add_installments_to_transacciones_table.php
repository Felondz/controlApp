<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     * Adds installment tracking for credit card transactions.
     */
    public function up(): void
    {
        Schema::table('transacciones', function (Blueprint $table) {
            // Number of installments (1-48)
            if (!Schema::hasColumn('transacciones', 'cuotas')) {
                $table->tinyInteger('cuotas')->unsigned()->default(1)->after('status');
            }

            // Current installment number being paid (for tracking)
            if (!Schema::hasColumn('transacciones', 'cuota_actual')) {
                $table->tinyInteger('cuota_actual')->unsigned()->nullable()->after('cuotas');
            }

            // Billing cycle in format "YYYY-MM" for grouping by month
            if (!Schema::hasColumn('transacciones', 'ciclo_facturacion')) {
                $table->string('ciclo_facturacion', 7)->nullable()->after('cuota_actual');
            }

            // Parent transaction ID for installment tracking
            if (!Schema::hasColumn('transacciones', 'transaccion_origen_id')) {
                $table->unsignedBigInteger('transaccion_origen_id')->nullable()->after('ciclo_facturacion');
                $table->foreign('transaccion_origen_id')->references('id')->on('transacciones')->onDelete('set null');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transacciones', function (Blueprint $table) {
            $table->dropForeign(['transaccion_origen_id']);
            $table->dropColumn(['cuotas', 'cuota_actual', 'ciclo_facturacion', 'transaccion_origen_id']);
        });
    }
};
