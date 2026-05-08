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
            $table->string('numero_factura')->nullable()->after('fecha');
            $table->date('fecha_emision')->nullable()->after('numero_factura');
            $table->date('fecha_vencimiento')->nullable()->after('fecha_emision');
            $table->timestamp('fecha_pago')->nullable()->after('fecha_vencimiento');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transacciones', function (Blueprint $table) {
            $table->dropColumn(['numero_factura', 'fecha_emision', 'fecha_vencimiento', 'fecha_pago']);
        });
    }
};
