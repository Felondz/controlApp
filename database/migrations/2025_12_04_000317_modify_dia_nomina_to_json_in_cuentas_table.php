<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Step 1: Add temporary column for JSON data
        Schema::table('cuentas', function (Blueprint $table) {
            $table->json('dias_nomina')->nullable()->after('dia_nomina');
        });

        // Step 2: Migrate existing data from dia_nomina to dias_nomina
        DB::table('cuentas')
            ->whereNotNull('dia_nomina')
            ->where('es_nomina', true)
            ->get()
            ->each(function ($cuenta) {
                DB::table('cuentas')
                    ->where('id', $cuenta->id)
                    ->update([
                        'dias_nomina' => json_encode([$cuenta->dia_nomina])
                    ]);
            });

        // Step 3: Drop old column and rename new column
        Schema::table('cuentas', function (Blueprint $table) {
            $table->dropColumn('dia_nomina');
        });

        Schema::table('cuentas', function (Blueprint $table) {
            $table->renameColumn('dias_nomina', 'dia_nomina');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Step 1: Add temporary integer column
        Schema::table('cuentas', function (Blueprint $table) {
            $table->integer('dia_nomina_int')->nullable()->after('dia_nomina');
        });

        // Step 2: Migrate data back (take first element of array)
        DB::table('cuentas')
            ->whereNotNull('dia_nomina')
            ->where('es_nomina', true)
            ->get()
            ->each(function ($cuenta) {
                $dias = json_decode($cuenta->dia_nomina, true);
                if (is_array($dias) && count($dias) > 0) {
                    DB::table('cuentas')
                        ->where('id', $cuenta->id)
                        ->update([
                            'dia_nomina_int' => $dias[0]
                        ]);
                }
            });

        // Step 3: Drop JSON column and rename integer column
        Schema::table('cuentas', function (Blueprint $table) {
            $table->dropColumn('dia_nomina');
        });

        Schema::table('cuentas', function (Blueprint $table) {
            $table->renameColumn('dia_nomina_int', 'dia_nomina');
        });
    }
};

