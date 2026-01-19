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
        Schema::table('transacciones', function (Blueprint $table) {
            // Index for dashboard list filtering by project and sorting by date
            // Accelerates: where('proyecto_id', $id)->orderBy('fecha', 'desc')
            $table->index(['proyecto_id', 'fecha'], 'idx_transacciones_proyecto_fecha');

            // Index for filtering pending bills/completed transactions per project
            // Accelerates: where('proyecto_id', $id)->where('status', $status)
            $table->index(['proyecto_id', 'status'], 'idx_transacciones_proyecto_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transacciones', function (Blueprint $table) {
            $table->dropIndex('idx_transacciones_proyecto_fecha');
            $table->dropIndex('idx_transacciones_proyecto_status');
        });
    }
};
