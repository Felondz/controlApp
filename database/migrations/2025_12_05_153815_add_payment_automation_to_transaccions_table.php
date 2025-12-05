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
        Schema::table('transacciones', function (Blueprint $table) {
            // Default payment account for bills
            $table->unsignedBigInteger('cuenta_predeterminada_id')->nullable()->after('cuenta_id');

            // Auto-debit flag (only for credit cards)
            $table->boolean('debito_automatico')->default(false)->after('cuenta_predeterminada_id');

            // Scheduled autopay date (fecha - 3 days)
            $table->dateTime('fecha_autopago')->nullable()->after('debito_automatico');

            // Foreign key constraint
            $table->foreign('cuenta_predeterminada_id')
                ->references('id')->on('cuentas')
                ->onDelete('set null');

            // Index for efficient autopay job queries
            $table->index(['debito_automatico', 'fecha_autopago'], 'autopay_schedule_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transacciones', function (Blueprint $table) {
            $table->dropForeign(['cuenta_predeterminada_id']);
            $table->dropIndex('autopay_schedule_index');
            $table->dropColumn(['cuenta_predeterminada_id', 'debito_automatico', 'fecha_autopago']);
        });
    }
};
