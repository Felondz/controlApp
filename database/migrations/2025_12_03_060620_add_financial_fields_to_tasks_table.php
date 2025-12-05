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
        Schema::table('tasks', function (Blueprint $table) {
            $table->boolean('is_financial')->default(false)->after('assigned_to');
            $table->decimal('amount', 15, 2)->nullable()->after('is_financial');
            $table->unsignedBigInteger('category_id')->nullable()->after('amount');

            $table->foreign('category_id')
                ->references('id')
                ->on('categorias')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropForeign(['category_id']);
            $table->dropColumn(['is_financial', 'amount', 'category_id']);
        });
    }
};
