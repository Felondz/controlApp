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
        Schema::table('etapas_proceso', function (Blueprint $table) {
            $table->foreignId('production_process_id')->nullable()->after('proyecto_id')->constrained('production_processes')->cascadeOnDelete();
        });

        Schema::table('lotes_produccion', function (Blueprint $table) {
            $table->foreignId('production_process_id')->nullable()->after('proyecto_id')->constrained('production_processes')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('etapas_proceso', function (Blueprint $table) {
            $table->dropForeign(['production_process_id']);
            $table->dropColumn('production_process_id');
        });

        Schema::table('lotes_produccion', function (Blueprint $table) {
            $table->dropForeign(['production_process_id']);
            $table->dropColumn('production_process_id');
        });
    }
};
