<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('proyectos', function (Blueprint $table) {
            $table->json('modules')->nullable()->after('descripcion');
            $table->string('color')->nullable()->after('modules');
            $table->string('icon')->nullable()->after('color');
        });

        // Asignamos el valor por defecto a los registros existentes manualmente
        DB::table('proyectos')->update(['modules' => json_encode(['finance'])]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('proyectos', function (Blueprint $table) {
            $table->dropColumn(['modules', 'color', 'icon']);
        });
    }
};
