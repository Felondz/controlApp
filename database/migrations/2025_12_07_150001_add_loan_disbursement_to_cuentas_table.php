<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     * Adds loan disbursement tracking fields to cuentas.
     */
    public function up(): void
    {
        Schema::table('cuentas', function (Blueprint $table) {
            // Amount of loan that was actually disbursed/received
            if (!Schema::hasColumn('cuentas', 'monto_desembolsado')) {
                $table->bigInteger('monto_desembolsado')->nullable()->after('cuotas_pagadas');
            }

            // Account where loan funds were deposited
            if (!Schema::hasColumn('cuentas', 'cuenta_destino_id')) {
                $table->unsignedBigInteger('cuenta_destino_id')->nullable()->after('monto_desembolsado');
                $table->foreign('cuenta_destino_id')->references('id')->on('cuentas')->onDelete('set null');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cuentas', function (Blueprint $table) {
            $table->dropForeign(['cuenta_destino_id']);
            $table->dropColumn(['monto_desembolsado', 'cuenta_destino_id']);
        });
    }
};
