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
        Schema::table('messages', function (Blueprint $table) {
            $table->foreignId('recipient_id')->nullable()->constrained('users')->nullOnDelete()->after('user_id');
            $table->timestamp('read_at')->nullable()->after('content');
        });

        Schema::table('proyecto_user', function (Blueprint $table) {
            $table->timestamp('last_read_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('messages', function (Blueprint $table) {
            $table->dropForeign(['recipient_id']);
            $table->dropColumn(['recipient_id', 'read_at']);
        });

        Schema::table('proyecto_user', function (Blueprint $table) {
            $table->dropColumn('last_read_at');
        });
    }
};
