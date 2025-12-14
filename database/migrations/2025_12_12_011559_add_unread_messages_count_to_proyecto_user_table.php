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
        Schema::table('proyecto_user', function (Blueprint $table) {
            $table->integer('unread_messages_count')->default(0)->after('rol');
            $table->index('unread_messages_count'); // For performance if needed later (ordering)
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('proyecto_user', function (Blueprint $table) {
            $table->dropColumn('unread_messages_count');
        });
    }
};
