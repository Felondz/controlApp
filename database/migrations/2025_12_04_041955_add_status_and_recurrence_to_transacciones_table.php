<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('transacciones', function (Blueprint $table) {
            $table->enum('status', ['completed', 'pending', 'cancelled'])->default('completed')->after('monto');
            $table->boolean('is_recurring')->default(false)->after('status');
            $table->enum('recurrence_interval', ['daily', 'weekly', 'biweekly', 'monthly', 'yearly'])->nullable()->after('is_recurring');
            $table->integer('recurrence_day')->nullable()->after('recurrence_interval'); // Day of month or week
            $table->date('next_occurrence')->nullable()->after('recurrence_day');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('transacciones', function (Blueprint $table) {
            $table->dropColumn(['status', 'is_recurring', 'recurrence_interval', 'recurrence_day', 'next_occurrence']);
        });
    }
};
