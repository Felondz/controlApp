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
        Schema::table('cuentas', function (Blueprint $table) {
            // Este es el saldo "vivo"
            $table->bigInteger('balance')
                ->default(0)
                ->after('balance_inicial');
        });
    }

    public function down(): void
    {
        Schema::table('cuentas', function (Blueprint $table) {
            $table->dropColumn('balance');
        });
    }
};
