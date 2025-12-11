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
        Schema::table('tasks', function (Blueprint $table) {
            // allows linking a task to LoteProduccion, SafetyIssue, etc.
            // column names: related_type, related_id
            $table->nullableMorphs('related');
        });

        Schema::table('transacciones', function (Blueprint $table) {
            // allows linking a transaction to InventarioMovement, PayrollRun, etc.
            // column names: source_type, source_id
            $table->nullableMorphs('source');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropMorphs('related');
        });

        Schema::table('transacciones', function (Blueprint $table) {
            $table->dropMorphs('source');
        });
    }
};
