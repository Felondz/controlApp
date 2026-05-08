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
        Schema::table('invitaciones', function (Blueprint $table) {
            $table->string('status')->default('pending')->after('token');
            $table->timestamp('accepted_at')->nullable()->after('status');
            $table->timestamp('cancelled_at')->nullable()->after('accepted_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('invitaciones', function (Blueprint $table) {
            $table->dropColumn(['status', 'accepted_at', 'cancelled_at']);
        });
    }
};
