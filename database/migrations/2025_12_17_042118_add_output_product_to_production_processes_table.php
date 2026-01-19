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
        Schema::table('production_processes', function (Blueprint $table) {
            $table->foreignId('inventory_item_id')->nullable()->constrained('inventory_items')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('production_processes', function (Blueprint $table) {
            $table->dropForeign(['inventory_item_id']);
            $table->dropColumn('inventory_item_id');
        });
    }
};
