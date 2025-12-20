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
        Schema::table('lotes_produccion', function (Blueprint $table) {
            $table->decimal('initial_quantity', 10, 2)->nullable()->change();
            $table->decimal('final_quantity', 10, 2)->nullable()->after('current_quantity');
            $table->timestamp('discarded_at')->nullable()->after('status');
            $table->string('discard_reason')->nullable()->after('discarded_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('lotes_produccion', function (Blueprint $table) {
            $table->decimal('initial_quantity', 10, 2)->nullable(false)->change();
            $table->dropColumn(['final_quantity', 'discarded_at', 'discard_reason']);
        });
    }
};
