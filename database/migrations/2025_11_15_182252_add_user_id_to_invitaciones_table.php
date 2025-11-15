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
            // Quién envió la invitación (el admin del proyecto)
            $table->foreignId('user_id')->nullable()->after('proyecto_id')->constrained()->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('invitaciones', function (Blueprint $table) {
            $table->dropForeignIdFor('User');
            $table->dropColumn('user_id');
        });
    }
};
