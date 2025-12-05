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
        Schema::table('cuentas', function (Blueprint $table) {
            if (!Schema::hasColumn('cuentas', 'plazo')) {
                $table->integer('plazo')->nullable()->after('limite_credito')->comment('Número total de cuotas');
            }
            if (!Schema::hasColumn('cuentas', 'valor_cuota')) {
                $table->bigInteger('valor_cuota')->nullable()->after('plazo')->comment('Valor de la cuota mensual en centavos');
            }
            if (!Schema::hasColumn('cuentas', 'cuotas_pagadas')) {
                $table->integer('cuotas_pagadas')->default(0)->nullable()->after('valor_cuota')->comment('Número de cuotas ya pagadas');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cuentas', function (Blueprint $table) {
            $table->dropColumn(['plazo', 'valor_cuota', 'cuotas_pagadas']);
        });
    }
};
