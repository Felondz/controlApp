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
            if (!Schema::hasColumn('cuentas', 'es_nomina')) {
                $table->boolean('es_nomina')->default(false)->after('tipo')->comment('Indica si es cuenta de nómina');
            }
            if (!Schema::hasColumn('cuentas', 'dia_nomina')) {
                $table->integer('dia_nomina')->nullable()->after('es_nomina')->comment('Día del mes en que se recibe la nómina');
            }
            if (!Schema::hasColumn('cuentas', 'valor_nomina')) {
                $table->bigInteger('valor_nomina')->nullable()->after('dia_nomina')->comment('Valor estimado de la nómina en centavos');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cuentas', function (Blueprint $table) {
            $table->dropColumn(['es_nomina', 'dia_nomina', 'valor_nomina']);
        });
    }
};
